package database

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListCancelMatch(currentPage, pageSize int, matchIds, stampUser string) ([]model.GridCancelMatch, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CANCEL_MATCH"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Match", "Cancel Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchIDs", matchIds),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridCancelMatch{}
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
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func UpdateCancelMatch(matchId, voidId int, voidReason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_MATCH"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Update", "CANCEL MATCH", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("VoidID", voidId),
		sql.Named("VoidReason", voidReason),
		sql.Named("StampUser", stampUser),
		&rs,
	)
	logManager.SetMatchIDorCustName(matchId)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Partai", matchId, []string{"void_id", "void_desc", "void_date"})
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
	if int(rs) == -1 {
		return errors.New(fmt.Sprintf("%d : The match already on process match.", matchId))
	} else if int(rs) == -10 {
		return errors.New(fmt.Sprintf("%d : The match still open.", matchId))
	}
	return err
}

func ListCancelMatchSpecial(matchId, sportId int, stampUser string) ([]model.GridCancelMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CANCEL_MATCH_SPECIAL"
	if sportId == 12 || sportId == 58 {
		spName = "MGMT_SBA_LIST_GRID_CANCEL_MATCH_SPECIAL_BASKETBALL"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Match Special", "Cancel Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridCancelMatchSpecial{}
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

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func UpdateCancelMatchSpecial(matchId, gameType, voidId, htHome, htAway, fsHome, fsAway int, voidDesc, voidChoice, cancelType, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_MATCH_SPECIAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "CANCEL MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", gameType),
		sql.Named("HT_Home", htHome),
		sql.Named("HT_Away", htAway),
		sql.Named("FS_Home", fsHome),
		sql.Named("FS_Away", fsAway),
		sql.Named("VoidID", voidId),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("VoidChoice", voidChoice),
		sql.Named("CancelType", cancelType),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchId)
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

func ListCancelMatchNextGoal(matchId int, stampUser string) ([]model.GridCancelMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_CANCEL_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Cancel Match Next Goal", "Cancel Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridCancelMatchSpecial{}
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

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func UpdateCancelMatchNextGoal(matchId, gameType, selection, voidId int, voidDesc, cancelType, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Status", "CANCEL MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", gameType),
		sql.Named("Selection", selection),
		sql.Named("VoidID", voidId),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("CancelType", cancelType),
		sql.Named("StampUser", stampUser),
	)
	// logManager.PrepareAudit(sqlConnections.conn[dbName], "Sport", sportID, []string{"No_Display"})
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

func UpdateCancelMatchSpecialBasket(matchId, gameType, voidId int, voidDesc, cancelType, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_CANCEL_MATCH_SPECIAL_BASKETBALL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Score", "CANCEL MATCH SPECIAL", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("GameType", gameType),

		sql.Named("VoidID", voidId),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("CancelType", cancelType),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchId)
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
