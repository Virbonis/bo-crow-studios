package config

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"sync"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/util/file"
	log "github.com/sirupsen/logrus"
	"gopkg.in/yaml.v2"
)

// initialize to default values, will be changed later when reading AppConfig or parsing command line
var AppConfig = configuration{
	BindPort: 3000,
	BindHost: "0.0.0.0",
}

// logSettings
type logSettings struct {
	LogFile string `yaml:"log_file"` // Path to the log file. If empty, write to stdout. If "syslog", writes to syslog
	Verbose bool   `yaml:"verbose"`  // If true, verbose logging is enabled
}

// configuration is loaded from YAML
// field ordering is important -- yaml fields will mirror ordering from here
type configuration struct {
	// Raw file data to avoid re-reading of configuration file
	// It's reset after config is parsed
	fileData []byte

	BindHost                 string                                 `yaml:"bind_host"` // BindHost is the IP address of the HTTP server to bind to
	BindPort                 int                                    `yaml:"bind_port"` // BindPort is the port the HTTP server
	Language                 string                                 `yaml:"language"`  // two-letter ISO 639-1 language code
	Redis                    cache.RedisConfiguration               // Redis server for data storage
	ConnectionStrings        database.ConnectionStringConfiguration `yaml:"connection_string"`
	DefaultPassword          string                                 `yaml:"default_password"`
	ElasticWebService        map[string]string                      `yaml:"elastic_webservice"`
	DefaultConfigNewOperator []string                               `yaml:"list_default_config_new_operator"`
	OperatorDetail           []string                               `yaml:"operator_detail"`
	ListClearRedisKey        []string                               `yaml:"list_clear_redis_key"`
	sync.RWMutex             `yaml:"-"`

	// Note: this array is filled only before file read/write and then it's cleared
	logSettings `yaml:",inline"`

	SchemaVersion int `yaml:"schema_version"`
}

// initialize to default values, will be changed later when reading config or parsing command line
func GetLogSettings(configFilename, workDir string) logSettings {
	l := logSettings{}
	yamlFile, err := readConfigFile(configFilename, workDir)
	if err != nil {
		return l
	}
	err = yaml.Unmarshal(yamlFile, &l)
	if err != nil {
		log.Error("Couldn't get logging settings from the configuration: %s", err)
	}
	return l
}

// getConfigFilename returns path to the current config file
func getConfigFilename(configFilename, workDir string) string {
	configFile, err := filepath.EvalSymlinks(configFilename)
	if err != nil {
		if !os.IsNotExist(err) {
			log.Error("unexpected error while config file path evaluation: %s", err)
		}
		configFile = configFilename
	}
	if !filepath.IsAbs(configFile) {
		configFile = filepath.Join(workDir, configFile)
	}
	return configFile
}

func readConfigFile(configFilename, workDir string) ([]byte, error) {
	configFile := getConfigFilename(configFilename, workDir)
	log.Debugf("Reading config file: %s", configFile)

	if len(AppConfig.fileData) != 0 {
		return AppConfig.fileData, nil
	}

	// configFile := getConfigFilename()
	d, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Error("Couldn't read config file %s: %s", configFile, err)
		return nil, err
	}
	return d, nil
}

// Saves configuration to the YAML file and also saves the user filter contents to a file
func (c *configuration) write(configFilename, workDir string) error {
	c.Lock()
	defer c.Unlock()

	configFile := getConfigFilename(configFilename, workDir)
	log.Debug("Writing YAML file: %s", configFile)
	yamlText, err := yaml.Marshal(&AppConfig)

	if err != nil {
		log.Error("Couldn't generate YAML file: %s", err)
		return err
	}

	err = file.SafeWrite(configFile, yamlText)
	if err != nil {
		log.Error("Couldn't save YAML config: %s", err)
		return err
	}

	return nil
}

// parseConfig loads configuration from the YAML file
func ParseConfig(configFilename, workDir string) error {
	yamlFile, err := readConfigFile(configFilename, workDir)
	if err != nil {
		return err
	}
	AppConfig.fileData = nil
	err = yaml.Unmarshal(yamlFile, &AppConfig)
	if err != nil {
		log.Error("Couldn't parse config file: %s", err)
		return err
	}

	return nil
}
