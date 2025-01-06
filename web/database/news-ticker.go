package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectWebsite(stampUser string) ([]model.SelectWesbite, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_WEBSITE_NEWS_TICKER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Website", "News Ticker", stampUser)
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

	list := []model.SelectWesbite{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func ListNewsTicker(newsID, websiteID int, lang string, newsSequence int, newsDisplayStatus, newsType string, currentPage, pageSize int, stampUser string) ([]model.NewsTicker, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_NEWS_TICKER"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List News Ticker", "News Ticker", stampUser)
	logManager.WriteParameters(
		sql.Named("NewsID", newsID),
		sql.Named("WebsiteID", websiteID),
		sql.Named("Lang", lang),
		sql.Named("NewsSequence", newsSequence),
		sql.Named("NewsDisplayStatus", newsDisplayStatus),
		sql.Named("NewsType", newsType),
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

	list := []model.NewsTicker{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}
func CreateNewsTicker(newsType string, newsSequence int, newsFromDateTime, newsToDateTime string, websiteID int, lang, news, username, newsDisplayStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_NEWS_TICKER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Insert News", "News Ticker", stampUser)
	logManager.WriteParameters(
		sql.Named("NewsType", newsType),
		sql.Named("NewsSequence", newsSequence),
		sql.Named("NewsFromDateTime", newsFromDateTime),
		sql.Named("NewsToDateTime", newsToDateTime),
		sql.Named("WebsiteIDs", websiteID),
		sql.Named("Lang", lang),
		sql.Named("News", news),
		sql.Named("Username", username),
		sql.Named("NewsDisplayStatus", newsDisplayStatus),
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
		log.Debugf("[mssql] EXEC %s", spName)
	}

	return err
}
func UpdateNewsTicker(newsID, newsSequence int, newsFromDateTime, newsToDateTime, news, username, newsType, newsDisplayStatus, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_NEWS_TICKER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update News", "News Ticker", stampUser)
	logManager.WriteParameters(
		sql.Named("NewsID", newsID),
		sql.Named("NewsSequence", newsSequence),
		sql.Named("NewsFromDateTime", newsFromDateTime),
		sql.Named("NewsToDateTime", newsToDateTime),
		sql.Named("News", news),
		sql.Named("Username", username),
		sql.Named("NewsType", newsType),
		sql.Named("NewsDisplayStatus", newsDisplayStatus),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "News", newsID, []string{"News", "From_Date", "To_Date", "Lang", "Website_ID", "Seq"})
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
func DeleteNewsTicker(newsID int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_NEWS_TICKER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Delete News", "News Ticker", stampUser)
	logManager.WriteParameters(
		sql.Named("NewsID", newsID),
		sql.Named("StampUser", stampUser),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "News", newsID, []string{"News", "Seq"})
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
