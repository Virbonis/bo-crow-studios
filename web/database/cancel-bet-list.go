package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCancelBet(branch, currency, userName, lang, baseCurr, stampUser string) ([]model.CancelBet, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_RPT_TRANS_CANCEL_LIST"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Bet", "LIST CANCEL BET", stampUser)
	logManager.WriteParameters(
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("UserName", userName),
		sql.Named("Lang", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CancelBet{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)

	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func ListCancelBetUser(branch, currency, lang, baseCurr, stampUser string) ([]model.CancelBetUser, error) {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_RPT_TRANS_CANCEL_USER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Bet User", "LIST CANCEL BET", stampUser)
	logManager.WriteParameters(
		sql.Named("Branch", branch),
		sql.Named("Currency", currency),
		sql.Named("Lang", lang),
		sql.Named("BaseCurr", baseCurr),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.CancelBetUser{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)

	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
