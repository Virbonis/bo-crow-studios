package database

import (
	"database/sql"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func CreateOutright(sportID, leagueID int, outrightDate string, maxPayout, priceStep, limitChange float64, outrightOpenStatus string, stampUser string) (int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_OUTRIGHT"
	var err error
	var outrightId int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Outright", "ADD OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("LeagueID", leagueID),
		sql.Named("OutrightDate", outrightDate),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("PriceStep", priceStep),
		sql.Named("LimitChange", limitChange),
		sql.Named("OutrightOpenStatus", outrightOpenStatus),
		sql.Named("OutrightID", sql.Out{Dest: &outrightId}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		logManager.SetMatchIDorCustName(outrightId)
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return outrightId, err
}
func CreateOutrightTeam(outrightId, teamSeq int, teamOdds float64, teamOpenStatus, teamPauseStatus string, clubId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_OUTRIGHT_TEAM"
	var err error
	var teamId int

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Outright Team", "ADD OUTRIGHT", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("ClubID", clubId),
		sql.Named("TeamSeq", teamSeq),
		sql.Named("TeamOdds", teamOdds),
		sql.Named("TeamOpenStatus", teamOpenStatus),
		sql.Named("TeamPauseStatus", teamPauseStatus),
		sql.Named("StampUser", stampUser),
		sql.Named("TeamID", sql.Out{Dest: &teamId}),
	)
	logManager.SetMatchIDorCustName(outrightId)
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

func ListOutright(fromDate, toDate string, sportId, outrightId int, outrightOpenStatus, outrightDeadHeatStatus, outrightScoreStatus string,
	currentPage, pageSize int, stampUser string) ([]model.GridOutright, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_OUTRIGHT"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Outright", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("FromDate", fromDate),
		sql.Named("ToDate", toDate),
		sql.Named("SportID", sportId),
		sql.Named("OutrightID", outrightId),
		sql.Named("OutrightOpenStatus", outrightOpenStatus),
		sql.Named("OutrightScoreStatus", outrightScoreStatus),
		sql.Named("OutrightDeadHeatStatus", outrightDeadHeatStatus),
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

	list := []model.GridOutright{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, totalRecords, nil
}
func DeleteOutright(outrightId int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Outright", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightId)
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

func ListOutrightTeam(outrightId int, stampUser string) ([]model.GridOutrightTeam, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_OUTRIGHT_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Outright Team", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.GridOutrightTeam{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}

func GetUpdateOutright(outrightId int, stampUser string) (*model.EditOutright, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_UPD_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Update Outright", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	model := model.EditOutright{}
	err = sqlConnections.conn[dbName].QueryRowx(spName, logManager.Parameters...).StructScan(&model)

	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return &model, nil
}
func ListUpdateOutrightTeam(outrightId int, stampUser string) ([]model.EditOutrightTeam, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_EDIT_OUTRIGHT_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Update Outright Team", "OUTRIGHT EDIT", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.EditOutrightTeam{}
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
		log.Debugf("[mssql] EXEC %s", spName)
	}
	return list, nil
}
func UpdateOutright(outrightID int, outrightDate string, maxPayout, priceStep, limitChange float64, outrightOpenStatus, outrightDeadHeatStatus string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_OUTRIGHT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Outright", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightID),
		sql.Named("OutrightDate", outrightDate),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("PriceStep", priceStep),
		sql.Named("LimitChange", limitChange),
		sql.Named("OutrightDeadHeatStatus", outrightDeadHeatStatus),
		sql.Named("OutrightOpenStatus", outrightOpenStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightID)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourWinner", outrightID, []string{"No_Partai", "Status", "Max_Bet", "Price_Step", "Limit_Change"})
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure UpdateOutright : %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
func UpdateOutrightTeam(outrightId, teamId, teamSeq int, teamOdds float64, teamOpenStatus, teamPauseStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_OUTRIGHT_TEAM"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Outright Team", "OUTRIGHT LIST", stampUser)
	logManager.WriteParameters(
		sql.Named("OutrightID", outrightId),
		sql.Named("TeamID", teamId),
		sql.Named("TeamSeq", teamSeq),
		sql.Named("TeamOdds", teamOdds),
		sql.Named("TeamOpenStatus", teamOpenStatus),
		sql.Named("TeamPauseStatus", teamPauseStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(outrightId)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "TourTeam", fmt.Sprintf("%d,%d", outrightId, teamId), []string{"No_Tour", "No_Sequence", "No_Club"})
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure UpdateOutrightTeam: %v", spName, err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return err
}
