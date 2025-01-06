package web

import (
	"context"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/router"
	"github.com/AxionHQ/tsubasa-admin/web/util"
	"github.com/gorilla/mux"
	"github.com/heptiolabs/healthcheck"
	"github.com/shopspring/decimal"
	log "github.com/sirupsen/logrus"
)

// Web - module object
type Web struct {
	conf       *WebConfig
	httpServer *http.Server // HTTP module
	condLock   sync.Mutex
	cond       *sync.Cond
	shutdown   bool
}

// WebConfig - Configuration for web module
type WebConfig struct {
	firstRun  bool
	BindHost  string
	BindPort  int
	PortHTTPS int
}

// CreateWeb - create module
func CreateWeb(conf *WebConfig) *Web {
	log.Info("Initialize web module")

	w := Web{}
	w.conf = conf

	r := mux.NewRouter()

	// Healthcheck
	// TODO: add app specific health and readiness checks as per https://github.com/heptiolabs/healthcheck
	health := healthcheck.NewHandler()
	r.Handle("/live", health)
	r.Handle("/ready", health)

	apiv1 := r.PathPrefix("/api/v1beta1").Subrouter()

	router.InitRouter("/", apiv1)

	// Static content
	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("client/build"))))
	// r.Use(loggingMiddleware)

	address := net.JoinHostPort(w.conf.BindHost, strconv.Itoa(w.conf.BindPort))
	w.httpServer = &http.Server{
		Addr: address,
		// Good practice to set timeouts to avoid Slowloris attacks.
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      r,
	}

	w.cond = sync.NewCond(&w.condLock)
	return &w
}

// Start - start serving HTTP requests
func (web *Web) Start() {
	printHTTPAddresses("http")

	decimal.MarshalJSONWithoutQuotes = true

	err := web.httpServer.ListenAndServe()
	if err != http.ErrServerClosed {
		cleanupAlways()
		log.Fatal(err)
	}
}

// prints IP addresses which user can use to open the admin interface
// proto is either "http" or "https"
func printHTTPAddresses(proto string) {
	var address string

	if config.AppConfig.BindHost == "0.0.0.0" {
		log.Infof("tsubasa-admin is available on the following addresses:")
		ifaces, err := util.GetValidNetInterfacesForWeb()
		if err != nil {
			// That's weird, but we'll ignore it
			address = net.JoinHostPort(config.AppConfig.BindHost, strconv.Itoa(config.AppConfig.BindPort))
			log.Printf("Go to %s://%s", proto, address)
			return
		}

		for _, iface := range ifaces {
			address = net.JoinHostPort(iface.Addresses[0], strconv.Itoa(config.AppConfig.BindPort))
			log.Printf("Go to %s://%s", proto, address)
		}
	} else {
		address = net.JoinHostPort(config.AppConfig.BindHost, strconv.Itoa(config.AppConfig.BindPort))
		log.Printf("Go to %s://%s", proto, address)
	}
}

// Close - stop HTTP server, possibly waiting for all active connections to be closed
func (web *Web) Close() {
	log.Info("Stopping HTTP server...")

	web.cond.L.Lock()
	web.shutdown = true
	web.cond.L.Unlock()

	if web.httpServer != nil {
		_ = web.httpServer.Shutdown(context.TODO())
	}
	log.Info("Stopped HTTP server")
}
