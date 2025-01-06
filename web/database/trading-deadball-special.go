package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func GetListTradingDeadballSpecial(matchTimeSlot, fromEarlyDate, toEarlyDate, isShowInActive, popupID, inGameType, sessionID, traderGroupInfo, stampUser string) ([]model.ListTradingDeadballSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_DEAD_BALL_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get List Trading Dead Ball Special", "Trading Dead Ball Special", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchTimeSlot", matchTimeSlot),
		sql.Named("FromEarlyDate", fromEarlyDate),
		sql.Named("ToEarlyDate", toEarlyDate),
		sql.Named("IsShowInActive", isShowInActive),
		sql.Named("PopupID", popupID),
		sql.Named("InGameType", inGameType),
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

	list := []model.ListTradingDeadballSpecial{}
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