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

func ListSelectRegion(stampUser string) ([]model.Region, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LEAGUE_REGION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Region", "Master Region", stampUser)
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

	list := []model.Region{}
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

func ListMasterRegion(stampUser string) ([]model.MasterRegion, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_REGION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Region", "Master Region", stampUser)
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

	list := []model.MasterRegion{}

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
func CreateMasterRegion(English, Mandarin, Taiwan, Thailand, Japanese, Korean, Vietnamese, Indonesia string, SortNumber, flag int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_REGION"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Region", "MASTER REGION", stampUser)
	logManager.WriteParameters(
		sql.Named("Sort_Number", SortNumber),
		sql.Named("Nama_RegionEN", English),
		sql.Named("Nama_RegionCH", Mandarin),
		sql.Named("Nama_RegionTW", Taiwan),
		sql.Named("Nama_RegionTH", Thailand),
		sql.Named("Nama_RegionJP", Japanese),
		sql.Named("Nama_RegionKR", Korean),
		sql.Named("Nama_RegionVN", Vietnamese),
		sql.Named("Nama_RegionID", Indonesia),
		sql.Named("FlagID", flag),
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

	_, err = sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}
	if rs == -1 {
		logManager.WriteStatusError("Region already exist")
		return errors.New("Region already exist")
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
func UpdateMasterRegion(RegionID int, English, Mandarin, Taiwan, Thailand, Japanese, Korean, Vietnamese, Indonesia string, SortNumber, Flag int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_REGION"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Region", "MASTER REGION", stampUser)
	logManager.WriteParameters(
		sql.Named("Region_ID", RegionID),
		sql.Named("Sort_Number", SortNumber),
		sql.Named("Nama_RegionEN", English),
		sql.Named("Nama_RegionCH", Mandarin),
		sql.Named("Nama_RegionTW", Taiwan),
		sql.Named("Nama_RegionTH", Thailand),
		sql.Named("Nama_RegionJP", Japanese),
		sql.Named("Nama_RegionKR", Korean),
		sql.Named("Nama_RegionVN", Vietnamese),
		sql.Named("Nama_RegionID", Indonesia),
		sql.Named("FlagID", Flag),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "Region", RegionID, []string{"Nama_Region"})
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
