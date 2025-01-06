package database

import (
	"database/sql"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListReportLedgerMain(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerMain, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_SMA"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Main", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerMain{}
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
func ListReportLedgerMainShareholderCash(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerMain, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_SHAREHOLDER_CASH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Main Shareholdercash", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerMain{}
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
func ListReportLedgerMainMember(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, AgentID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerMainMember, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_MEMBER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Main Member", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("AgentID", AgentID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.ReportLedgerMainMember{}
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

func ListReportLedgerAverage(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerAverage, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_AVG_SMA"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Average", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerAverage{}
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
func ListReportLedgerAvgShareholderCash(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerAverage, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_AVG_SHAREHOLDER_CASH"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Main Shareholdercash", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerAverage{}
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
func ListReportLedgerAvgMember(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, AgentID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerAvgMember, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_AVG_MEMBER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger Main Member", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("AgentID", AgentID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerAvgMember{}
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

func ListReportLedgerNew(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerMain, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_NEW_SHAREHOLDER"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger New Shareholder", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("Draw", Draw),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerMain{}
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
func ListReportLedgerNewShareholderCash(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, BetAdj, ShareholderID, SSMAID, SMAID, Username, HistOrPost, stampUser string) ([]model.ReportLedgerMain, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_NEW_SHAREHOLDER_CASH"
	var err error
	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger New Shareholder Cash", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("CustomerType", CustomerType),
		sql.Named("Branch", Branch),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("BetAdj", BetAdj),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerMain{}
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
func ListReportLedgerNewMember(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, AgentID, Username, BetAdj, HistOrPost, stampUser string) ([]model.ReportLedgerMainMember, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_LEDGER_NEW_MEMBER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Ledger New Member", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("Branch", Branch),
		sql.Named("CustomerType", CustomerType),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("AgentID", AgentID),
		sql.Named("Username", Username),
		sql.Named("BetAdj", BetAdj),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.ReportLedgerMainMember{}
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

func ListReportLedgerBreakdown(FromDate, ToDate, CustomerType, Branch string, GameType, SportID int, VIP, Currency string, Draw int, ShareholderID, SSMAID, SMAID, Username string, ReportType, HistOrPost string, UserTeamID int, stampUser string) ([]model.ReportLedgerMain, int, error) {
	dbName := Inetsoccer
	var spName string
	switch ReportType {
	case "Branch":
		spName = "MGMT_SBA_RPT_LEDGER_BRANCH"
	case "Sport":
		spName = "MGMT_SBA_RPT_LEDGER_SPORT"
	case "League":
		spName = "MGMT_SBA_RPT_LEDGER_LEAGUE"
	case "Match":
		spName = "MGMT_SBA_RPT_LEDGER_MATCH"
	case "GameType":
		spName = "MGMT_SBA_RPT_LEDGER_GAMETYPE"
	}
	CurrentPage := 1
	PageSize := 50

	var err error
	var totalRes int

	logManager := logger.LogManager{}
	logManager.StartTask("List Report Breakdown Match", "Ledger", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", FromDate),
		sql.Named("GLDateTo", ToDate),
		sql.Named("Branch", Branch),
		sql.Named("CustomerType", CustomerType),
		sql.Named("GameType", GameType),
		sql.Named("SportID", SportID),
		sql.Named("VIPFilter", VIP),
		sql.Named("Currency", Currency),
		sql.Named("Draw", Draw),
		sql.Named("ShareholderID", ShareholderID),
		sql.Named("SSMAID", SSMAID),
		sql.Named("SMAID", SMAID),
		sql.Named("Username", Username),
		sql.Named("CurrentPage", CurrentPage),
		sql.Named("PageSize", PageSize),
		sql.Named("HistOrPost", HistOrPost),
		sql.Named("UserTeamID", UserTeamID),
		sql.Named("StampUser", stampUser),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRes}),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()
	list := []model.ReportLedgerMain{}
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
	return list, totalRes, nil
}

func ListReportBetDetail(GLDateFrom, GLDateTo, CustomerType, Branch string, Gametype, SportID int, VIP, Currency string, Draw, LeagueID, MatchID int, BetAdj, Username, Status7, OrderBy, STLive string, CurrentPage, PageSize int, ReportType, HistOrPost string, UserteamID int, stampUser string) ([]model.ReportLedgerBetDetail, *model.GrandTotalBetDetail, int, error) {
	dbName := Inetsoccer
	var spName string
	if ReportType == "Sport" || ReportType == "League" || ReportType == "Match" || ReportType == "Branch" {
		spName = "MGMT_SBA_RPT_LEDGER_BET_DETAIL_" + strings.ToUpper(ReportType)
	} else if ReportType == "GameType" {
		spName = "MGMT_SBA_RPT_LEDGER_BET_DETAIL_GAMETYPE"
	} else {
		spName = "MGMT_SBA_RPT_LEDGER_BET_DETAIL"
	}
	var err error
	var totalData int

	logManager := logger.LogManager{}
	logManager.StartTask("Get Bet Detail", "Ledger", stampUser)
	if ReportType != "GameType" {
		logManager.WriteParameters(
			sql.Named("GLDateFrom", GLDateFrom),
			sql.Named("GLDateTo", GLDateTo),
			sql.Named("CustomerType", CustomerType),
			sql.Named("Branch", Branch),
			sql.Named("GameType", Gametype),
			sql.Named("SportID", SportID),
			sql.Named("VIPFilter", VIP),
			sql.Named("Currency", Currency),
			sql.Named("Draw", Draw),
			sql.Named("LeagueID", LeagueID),
			sql.Named("MatchID", MatchID),
			sql.Named("BetAdj", BetAdj),
			sql.Named("Username", Username),
			sql.Named("Status7", Status7),
			sql.Named("OrderBy", OrderBy),
			sql.Named("CurrentPage", CurrentPage),
			sql.Named("PageSize", PageSize),
			sql.Named("HistOrPost", HistOrPost),
			sql.Named("UserTeamID", UserteamID),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalData}),
		)
	} else {
		logManager.WriteParameters(
			sql.Named("GLDateFrom", GLDateFrom),
			sql.Named("GLDateTo", GLDateTo),
			sql.Named("CustomerType", CustomerType),
			sql.Named("Branch", Branch),
			sql.Named("GameType", Gametype),
			sql.Named("SportID", SportID),
			sql.Named("VIPFilter", VIP),
			sql.Named("Currency", Currency),
			sql.Named("Draw", Draw),
			sql.Named("LeagueID", LeagueID),
			sql.Named("MatchID", MatchID),
			sql.Named("BetAdj", BetAdj),
			sql.Named("Username", Username),
			sql.Named("Status7", Status7),
			sql.Named("OrderBy", OrderBy),
			sql.Named("ST_Live", STLive),
			sql.Named("CurrentPage", CurrentPage),
			sql.Named("PageSize", PageSize),
			sql.Named("HistOrPost", HistOrPost),
			sql.Named("UserTeamID", UserteamID),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalData}),
		)
	}
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ReportLedgerBetDetail{}
	summary := model.GrandTotalBetDetail{}
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed scanning row: %v", err)
		return nil, nil, 0, err
	}

	rows.NextResultSet()
	for rows.Next() {
		err = rows.StructScan(&summary)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}

	return list, &summary, totalData, nil
}
