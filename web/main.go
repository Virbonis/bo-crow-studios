package web

import (
	"fmt"
	"io/ioutil"
	"os"
	"os/signal"
	"path/filepath"
	"runtime"
	"syscall"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/mattn/go-colorable"
	log "github.com/sirupsen/logrus"
	flag "github.com/spf13/pflag"
)

const (
	configSyslog = "syslog"
	serviceName  = "BlaiseClient"
	dataDir      = "data"    // data storage
	filterDir    = "filters" // cache location for downloaded filters, it's under DataDir
)

// Update-related variables
var (
	versionString = "dev"
)

// command-line arguments
type options struct {
	verbose        bool   // is verbose logging enabled
	configFilename string // path to the config file
	bindHost       string // host address to bind HTTP server on
	bindPort       int    // port to serve HTTP pages on
	logFile        string // Path to the log file. If empty, write to stdout. If "syslog", writes to syslog
	pidFile        string // File name to save PID to
	workDir        string // path to the working directory where we will store the filters data and the querylog

	// service control action (see service.ControlAction array + "status" command)
	serviceControlAction string

	// runningAsService flag is set to true when options are passed from the service runner
	runningAsService bool
}

// Context - a global context object
var Context applicationContext

// Global context
type applicationContext struct {
	// Modules
	// --
	web *Web // Web (HTTP, HTTPS) module
	// server         *service.BlaiseServer    // BlaiseServer module
	// sqlConnections *database.SQLConnections // Database module
	// cache          *cache.Cache             // Cache module

	// Runtime properties
	// --
	OperatorID       string         // Operator ID running this website
	configFilename   string         // Config filename (can be overridden via the command line arguments)
	workDir          string         // Location of our directory, used to protect against CWD being somewhere else
	appSignalChannel chan os.Signal // Channel for receiving OS signals by the console app
	pidFileName      string         // PID file name.  Empty if no PID file was created.
	runningAsService bool           // runningAsService flag is set to true when options are passed from the service runner
}

// getDataDir returns path to the directory where we store databases and filters
func (c *applicationContext) getDataDir() string {
	return filepath.Join(c.workDir, dataDir)
}

// Main is the entry point
func Main(version string, channel string, armVer string) {
	// Init update-related global variables
	versionString = version
	// Load options
	args := loadOptions()

	if args.serviceControlAction != "" {
		// If we want to run this as a service
		// handleServiceControlAction(args.serviceControlAction)
		return
	}

	Context.appSignalChannel = make(chan os.Signal)
	signal.Notify(Context.appSignalChannel, syscall.SIGINT, syscall.SIGTERM, syscall.SIGHUP, syscall.SIGQUIT)
	go func() {
		for {
			sig := <-Context.appSignalChannel
			log.Info("Received signal '%s'", sig)
			switch sig {
			case syscall.SIGHUP: // reload signal
			default:
				cleanup()
				cleanupAlways()
				os.Exit(0)
			}
		}
	}()

	run(args)
}

func loadOptions() options {
	o := options{}

	var printHelp func()

	flag.StringVar(&o.configFilename, "config", "", "Path to the config files")
	flag.StringVar(&o.workDir, "w", "", "Path to the working directory")
	flag.StringVarP(&o.logFile, "log", "l", "", "Path to log file. If empty: write to stdout; if 'syslog': write to system log")
	var verbose = flag.BoolP("verbose", "v", false, "verbose output")
	var help = flag.BoolP("help", "h", false, "Print this help")

	flag.CommandLine.SortFlags = false

	printHelp = func() {
		fmt.Printf("Usage:\n\n")
		fmt.Printf("%s [options]\n\n", os.Args[0])
		fmt.Printf("Options:\n")

		flag.PrintDefaults()
		os.Exit(64)
	}

	flag.Parse()

	if *help {
		printHelp()
	}

	if *verbose {
		o.verbose = true
	}

	return o
}

// run is a blocking method!
// nolint
func run(args options) {
	// config file path can be overridden by command-line arguments:
	if args.configFilename != "" {
		Context.configFilename = args.configFilename
	} else {
		// Default config file name
		Context.configFilename = "config.yaml"
	}

	// configure working dir and config path
	initWorkingDir(args)

	// configure log level and output
	configureLogger(args)

	msg := "tsubasa-admin, version %s, arch %s %s"
	log.Printf(msg, versionString, runtime.GOOS, runtime.GOARCH)
	log.Debug("Current working directory is %s", Context.workDir)
	if args.runningAsService {
		log.Info("tsubasa-admin is running as a service")
	}
	Context.runningAsService = args.runningAsService

	configExist := isConfigExist()
	if !configExist {
		log.Error("Failed to parse configuration, exiting")
		os.Exit(1)
	}

	// Load configuration file
	err := config.ParseConfig(Context.configFilename, Context.workDir)
	if err != nil {
		log.Error("Failed to parse configuration, exiting")
		os.Exit(1)
	}

	// override bind host/port from the console
	if args.bindHost != "" {
		config.AppConfig.BindHost = args.bindHost
	}
	if args.bindPort != 0 {
		config.AppConfig.BindPort = args.bindPort
	}
	if len(args.pidFile) != 0 && writePIDFile(args.pidFile) {
		Context.pidFileName = args.pidFile
	}

	// Datadir is needed if we want to save temporary file to local folder
	// tsubasa-admin is stateless application - all files inside data folder will be deleted during server restart
	err = os.MkdirAll(Context.getDataDir(), 0755)
	if err != nil {
		log.Fatalf("Cannot create data dir at %s: %s", Context.getDataDir(), err)
	}

	// Blaiserver instance
	// Context.server = service.NewBlaiseServer(config.Config.ServerAPI)
	// service.InitServiceAPI(config.AppConfig.ServerAPI)

	// Database server
	database.InitSQLConnection(config.AppConfig.ConnectionStrings, args.verbose)
	// aLog.Init(sql.BlaiseDB)

	cache.InitCacheEngine(config.AppConfig.Redis)
	// Context.cache = cache.InitCacheEngine(config.Config.Redis)

	webConf := WebConfig{
		BindHost: config.AppConfig.BindHost,
		BindPort: config.AppConfig.BindPort,
	}
	Context.web = CreateWeb(&webConf)
	if Context.web == nil {
		log.Fatalf("Can't initialize Web module")
	}

	Context.web.Start()

	// wait indefinitely for other go-routines to complete their job
	select {}
}

// initWorkingDir initializes the workDir
// if no command-line arguments specified, we use the directory where our binary file is located
func initWorkingDir(args options) {
	log.Info("Initializing WorkDir")
	execPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	if args.workDir != "" {
		// If there is a custom config file, use it's directory as our working dir
		Context.workDir = args.workDir
	} else {
		Context.workDir = filepath.Dir(execPath)
	}
}

// configureLogger configures logger level and output
func configureLogger(args options) {
	// log.SetFormatter(&log.JSONFormatter{})
	// log.SetReportCaller(true)

	log.SetFormatter(&log.TextFormatter{ForceColors: true})
	log.SetOutput(colorable.NewColorableStdout())

	ls := config.GetLogSettings(Context.configFilename, Context.workDir)

	// command-line arguments can override config settings
	if args.verbose {
		ls.Verbose = true
	}
	if args.logFile != "" {
		ls.LogFile = args.logFile
	}

	if ls.Verbose {
		log.SetLevel(log.DebugLevel)
	}

	if ls.LogFile == "" {
		return
	}

	if ls.LogFile == configSyslog {
		// TODO: Init syslog
	} else {
		logFilePath := filepath.Join(Context.workDir, ls.LogFile)
		if filepath.IsAbs(ls.LogFile) {
			logFilePath = ls.LogFile
		}

		file, err := os.OpenFile(logFilePath, os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
		if err != nil {
			log.Fatalf("cannot create a log file: %s", err)
		}
		log.SetOutput(file)
	}
}

// Write PID to a file
func writePIDFile(fn string) bool {
	data := fmt.Sprintf("%d", os.Getpid())
	err := ioutil.WriteFile(fn, []byte(data), 0644)
	if err != nil {
		log.Error("Couldn't write PID to file %s: %v", fn, err)
		return false
	}
	return true
}

func isConfigExist() bool {
	configfile := Context.configFilename
	if !filepath.IsAbs(configfile) {
		configfile = filepath.Join(Context.workDir, Context.configFilename)
	}
	_, err := os.Stat(configfile)
	if !os.IsNotExist(err) {
		// do nothing, file exists
		return true
	}
	return false
}

func cleanup() {
	log.Info("Stopping tsubasa-admin")

	if Context.web != nil {
		Context.web.Close()
		Context.web = nil
	}

	//TODO: clean up other modules here...
}

// This function is called before application exits
func cleanupAlways() {
	if len(Context.pidFileName) != 0 {
		_ = os.Remove(Context.pidFileName)
	}
	log.Info("Shutting down...")
}
