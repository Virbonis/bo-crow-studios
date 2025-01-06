package database

import (
	"encoding/base64"
	"reflect"
	"sync"

	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/logger"
	_ "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

const connectionEncryptionKey = "eShVmYq3t6w9z$C&"

type ConnectionStringConfiguration struct {
	Inetsoccer      string `yaml:"connection_string_IS"`
	Inetsoccer_Post string `yaml:"connection_string_IPost"`
	Inetsoccer_Log  string `yaml:"connection_string_Log"`
	// Inetsoccer_Hist     string `yaml:"connection_string_IHist"`
	Inetsoccer_Log_Hist string `yaml:"connection_string_LogHist"`
	MgmtGames           string `yaml:"connection_string_Games"`
	SecureUserID        string `yaml:"connection_string_SUI"`
	SoccerBot           string `yaml:"connection_string_SB"`
	GoldenOdds          string `yaml:"connection_string_GO"`
	RunningBall         string `yaml:"connection_string_RB"`
	BetGenius           string `yaml:"connection_string_BG"`
	BetBazar            string `yaml:"connection_string_BBZ"`
	// RTSFootball  string `yaml:"connection_string_RTS"`
	// IM  string `yaml:"connection_string_IM"`
	BTI string `yaml:"connection_string_BTI"`
}

var sqlConnections *SQLConnections

type SQLConnections struct {
	conn    map[string]*sqlx.DB
	Verbose bool
}

const (
	Inetsoccer          = "Inetsoccer"
	Inetsoccer_Post     = "Inetsoccer_Post"
	Inetsoccer_Log      = "Inetsoccer_Log"
	Inetsoccer_Hist     = "Inetsoccer_Hist"
	Inetsoccer_Log_Hist = "Inetsoccer_Log_Hist"
	MgmtGames           = "MgmtGames"
	SecureUserID        = "SecureUserID"
	SoccerBot           = "SoccerBot"
	GoldenOdds          = "GoldenOdds"
	RunningBall         = "RunningBall"
	BetGenius           = "BetGenius"
	BetBazar            = "BetBazar"
	RTSFootball         = "RTSFootball"
	IM                  = "IM"
	BTI                 = "BTI"
)

func InitSQLConnection(connectionStrings ConnectionStringConfiguration, verbose bool) {
	// init sql connection with go routine
	var wg sync.WaitGroup
	sqlConnections = &SQLConnections{conn: make(map[string]*sqlx.DB)}
	v := reflect.ValueOf(connectionStrings)
	typeOfS := v.Type()
	for i := 0; i < v.NumField(); i++ {
		key := typeOfS.Field(i).Name
		conn := v.Field(i).Interface().(string)
		if conn != "" {
			wg.Add(1)
			go func() {
				defer wg.Done()
				sqlConnections.conn[key] = newSQLConnection(key, DecryptConnectionString(conn))
			}()
		}
	}
	wg.Wait()

	sqlConnections.Verbose = verbose
	logger.InitLogConnection(sqlConnections.conn["Inetsoccer_Log"])
}

func newSQLConnection(key, connectionString string) *sqlx.DB {
	log.Infof("[mssql] connecting to SQL Server: %s", key)

	db, err := sqlx.Open("sqlserver", connectionString)
	if err != nil {
		log.Fatalf("[mssql] Error connecting to SQL Server: %v", err)
	}

	selectVersion(db)

	return db.Unsafe()
}

func selectVersion(db *sqlx.DB) {
	err := db.Ping()
	if err != nil {
		log.Fatalf("[mssql] Error pinging database: %v", err)
	}

	var result string

	// exec query
	err = db.QueryRow("select @@version").Scan(&result)
	if err != nil {
		log.Fatalf("[mssql] Scan failed: %v", err)
	}
	log.Infof("%s", result)
}

func EncryptConnectionString(data string) string {
	key := []byte(connectionEncryptionKey)
	dataConn := []byte(data)

	ciphertext, err := helper.EncryptToken(key, dataConn)
	if err != nil {
		log.Warnf("Error generating connection string %v", err)
		return ""
	}

	return base64.URLEncoding.EncodeToString(ciphertext)
}

func DecryptConnectionString(data string) string {
	key := []byte(connectionEncryptionKey)
	decodedByte, err := base64.URLEncoding.DecodeString(data)
	if err != nil {
		log.Debugf("Decode base 64 connection string error: %v accessToken: %s", err, data)
		return ""
	}

	result, err := helper.DecryptToken(key, decodedByte)
	if err != nil {
		log.Warnf("Error generating connection string %v", err)
		return ""
	}

	return string(result)
}
