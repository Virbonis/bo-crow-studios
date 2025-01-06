package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMemberDuplicateIP(loginDateFrom, loginDateTo, ipAddress string, currentPage, pageSize int, stampUser string) ([]model.MemberDuplicateIP, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_MEMBER_DUPLICATE_IP" // + hist
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Member Duplicate IP", "Member Duplicate IP", stampUser)
	logManager.WriteParameters(
		sql.Named("LoginDateFrom", loginDateFrom),
		sql.Named("LoginDateTo", loginDateTo),
		sql.Named("IPAddress", ipAddress),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MemberDuplicateIP{}
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
