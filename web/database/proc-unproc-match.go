package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListProcessMatch(MatchID, SportID, LeagueID, CurrentPage, PageSize int, MatchDate, MatchStatus, HTStatus, FTStatus, FGLGStatus, stampUser string) ([]model.ProcessMatch, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PROCESS_MATCH"
	var err error
	var totalRecord int

	logManager := logger.LogManager{}
	logManager.StartTask("List Process Match", "Process Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", MatchID),
		sql.Named("SportID", SportID),
		sql.Named("LeagueID", LeagueID),
		sql.Named("MatchDate", MatchDate),
		sql.Named("MatchScoreStatus", MatchStatus),
		sql.Named("HTProcessStatus", HTStatus),
		sql.Named("FTProcessStatus", FTStatus),
		sql.Named("FGLGProcessStatus", FGLGStatus),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecord}),
		sql.Named("StampUser", stampUser),
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
		return nil, 0, err
	}

	var list []model.ProcessMatch

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	return list, totalRecord, nil
}
func ListProcessMatchSpecial(matchId, sportId int, stampUser string) ([]model.ProcessMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PROCESS_MATCH_SPECIAL"
	if sportId == 12 || sportId == 58 {
		spName = "MGMT_SBA_LIST_GRID_PROCESS_MATCH_SPECIAL_BASKETBALL"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Process Match Special", "Process Match", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ProcessMatchSpecial{}
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

func ListUnprocessMatch(matchId, sportId, leagueId int, matchDate, matchScoreStatus, htProcessStatus, ftpProcessStatus, fglgProcessStatus string, currentPage, pageSize int, stampUser string) ([]model.ProcessMatch, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_UNPROCESS_MATCH"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Unprocess Match", "Unprocess Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("LeagueID", leagueId),
		sql.Named("MatchDate", matchDate),
		sql.Named("MatchScoreStatus", matchScoreStatus),
		sql.Named("HTProcessStatus", htProcessStatus),
		sql.Named("FTProcessStatus", ftpProcessStatus),
		sql.Named("FGLGProcessStatus", fglgProcessStatus),
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

	list := []model.ProcessMatch{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}
func ListUnprocessMatchSpecial(matchId, sportId int, stampUser string) ([]model.ProcessMatchSpecial, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_UNPROCESS_MATCH_SPECIAL"
	if sportId == 12 || sportId == 58 {
		spName = "MGMT_SBA_LIST_GRID_UNPROCESS_MATCH_SPECIAL_BASKETBALL"
	}
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Unprocess Match Special", "Unprocess Match", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ProcessMatchSpecial{}
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

func CreateQueueJobProcessMatch(matchId, processType int, processReason, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_QUEUE_JOB_PROCESS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Create Queue Process Match", "Match Process", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ProcessType", processType),
		sql.Named("ProcessReason", processReason),
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
func DeleteQueueJobProcessMatch(matchId, processType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_QUEUE_JOB_PROCESS"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Queue Process Match", "Process Match", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ProcessType", processType),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func CreateQueueJobProcessSpecial(matchId, processType, sportId int, processReason string, selection int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_QUEUE_JOB_PROCESS_SPECIAL"
	if sportId == 12 || sportId == 58 {
		spName = "MGMT_SBA_PROC_INS_QUEUE_JOB_PROCESS_SPECIAL_BASKETBALL"
	}
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("Create Queue Process Match Special", "Process Match Special", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchId),
		sql.Named("ProcessType", processType),
		sql.Named("ProcessReason", processReason),
		sql.Named("Selection", selection),
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

// ngnc
func ListProcessMatchNextGoal(matchId int, stampUser string) ([]model.ProcessMatchNextGoal, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PROCESS_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Unprocess Match", "Match List Grid Unprocess Match", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ProcessMatchNextGoal{}
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
func ListUnprocessMatchNextGoal(matchId int, stampUser string) ([]model.UprocessMatchNextGoal, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_UNPROCESS_MATCH_NEXTGOAL"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Unprocess Match", "Match List Grid Unprocess Match", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Partai", matchId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.UprocessMatchNextGoal{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
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
