package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetListTradingRunningBall(isShowInActive, isMatchConfirmed, sessionID, traderGroupInfo, stampUser string) ([]model.ListTradingRunningBall, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_RUNNING_BALL"
	var err error
	var result int

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Trading Running Ball", "Trading Running Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("IsMatchConfirmed", isMatchConfirmed),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
		sql.Named("PausedMatches", sql.Out{Dest: &result}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListTradingRunningBall{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, result, nil
}

func GetListTradingRunningBallPopUp(matchID int, isShowInActive, sessionID, traderGroupInfo, stampUser string) ([]model.ListTradingRunningBall, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_RUNNING_BALL_BY_MATCH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Trading Running Ball Pop Up", "Trading Running Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("SessionID", sessionID),
		sql.Named("TraderGroup", traderGroupInfo),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListTradingRunningBall{}
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

func GetListPendingSummary(matchID int, stampUser string) ([]model.ListPendingSummary, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PENDING_SUMMARY_RUNNING_BALL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Pending Summary Running Ball", "Trading Running Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListPendingSummary{}
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

func GetListPAR(matchID int, mode, sessionID, stampUser string) ([]model.ListPAR, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PAR_RUNNING_BALL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List PAR Running Ball", "Trading Running Ball", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("Mode", mode),
		sql.Named("SessionID", sessionID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ListPAR{}
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
