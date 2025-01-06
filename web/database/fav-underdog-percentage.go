package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListFavUnderdogPercentage(dateFrom, dateTo, branchCode, currency, product string, sportID int, stampUser string) ([]model.FavUnderdogPercentageList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_FAV_UNDERDOG_PERCENTAGE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Fav Underdog Percentage", "FAV UNDERDOG PERCENTAGE", stampUser)
	logManager.WriteParameters(
		sql.Named("DateFrom", dateFrom),
		sql.Named("DateTo", dateTo),
		sql.Named("BranchCode", branchCode),
		sql.Named("Currency", currency),
		sql.Named("Product", product),
		sql.Named("SportID", sportID),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.FavUnderdogPercentageList{}
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
