package database

import (
	"database/sql"
	"errors"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func LoadSummaryTraderDeadBallCopy(MatchID int, stampUser string) ([]model.TraderDeadBall, error) {

	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_GET_SUMMARY_TRADER_DEADBALL_COPY"
	var err error
	list := []model.TraderDeadBall{}
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Get Summary Trader DeadBall Copy ", "Breakdown Patching", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, err
	}
	if int(rs) == -99 {
		logManager.WriteStatusError("Deadball Breakdown Report For This Match ID is not Found !")
		return nil, errors.New("Deadball Breakdown Report For This Match ID is not Found !")
	}
	return list, nil
}

func UpdSummaryTraderDeadBallCopy(MatchID int, Trader string, UserTeamsID, UserTeamSubID int, SpecialCode, stampUser string) error {
	dbName := Inetsoccer_Post
	spName := "MGMT_SBA_PROC_UPD_SUMMARY_TRADER_DEADBALL_COPY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("COPY", "BREAKDOWN PATCHING", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("Trader", Trader),
		sql.Named("UserTeams_ID", UserTeamsID),
		sql.Named("UserTeamSub_ID", UserTeamSubID),
		sql.Named("SpecialCode", SpecialCode),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(MatchID)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
