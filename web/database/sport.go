package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectSport(stampUser string) ([]model.Sport, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_SPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Sport", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Sport{}
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

func ListSport(stampUser string) ([]model.Sport, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_SPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sport", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.Sport{}
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

func UpdateSport(sportID int, sportnameenus string, sportnamezhcn string, sportnamethth string, sportnamejajp string, sportnamekokr string, sportnamevivn string, sportnameidid string, sitenodisplay int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_SPORT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sport", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("SportID", sportID),
		sql.Named("SportNameEnUS", sportnameenus),
		sql.Named("SportNameZhCN", sportnamezhcn),
		sql.Named("SportNameThTH", sportnamethth),
		sql.Named("SportNameJaJP", sportnamejajp),
		sql.Named("SportNameKoKR", sportnamekokr),
		sql.Named("SportNameViVN", sportnamevivn),
		sql.Named("SportNameIdID", sportnameidid),
		sql.Named("SiteNoDisplay", sitenodisplay),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Sport", sportID, []string{"Nama_Sport"})
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

func ListSportSorting(stampUser, currency string) ([]model.SportSorting, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_SPORT_SORTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sport Sorting", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("StampUser", stampUser),
		sql.Named("Currency", currency),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SportSorting{}
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

func UpdateSportSorting(sportID, noDisplay int, currency, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_SPORT_SORTING"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Sport Sorting", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("Currency", currency),
		sql.Named("SportID", sportID),
		sql.Named("Site_NoDisplay", noDisplay),
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

func SportSortingCopy(currency string, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_SPORT_SORTING_COPY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Sport Sorting Copy", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("Currency", currency),
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

func ListSportDelayBet(NoSport int, stampUser string) ([]model.SportDelayBet, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_SPORT_DELAYBET"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Sport Delay Bet", "Master Sport", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Sport", NoSport),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.SportDelayBet{}
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
