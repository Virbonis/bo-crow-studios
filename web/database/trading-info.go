package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetMatchTradingInfo(matchID int, stampUser string) (*model.TradingInfo, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_TRADING_INFO"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Get Trading Info", "TRADING INFO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	model := model.TradingInfo{}
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(&model)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, nil
}

func ListTradingInfo(matchID int, stampUser string) ([]model.GridTradingInfo, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_TRADING_INFO"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Trading Info", "TRADING INFO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	list := []model.GridTradingInfo{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func CreateTradingInfo(matchID int, message, orderAH, orderOU, traderGroup string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_TRADING_INFO"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Trading Info", "TRADING INFO", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Message", message),
		sql.Named("Order_AH", orderAH),
		sql.Named("Order_OU", orderOU),
		sql.Named("Trader_Group", traderGroup),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
