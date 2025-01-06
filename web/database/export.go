package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListExportBetEnquiry(fromBetDate, toBetDate, fromBetID, toBetID, gameTypes, betStatus, sportIDs string, matchID int, branchID string, betAmtFrom, betAmtTo int, username, switchToMatchDate, voidUser, orderBy string, currentPage, pageSize int, histOrPost, buyback, txnType string, vipFilter int, currency, product string, stampUser string) ([]model.ExportBetEnquiry, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_EXPORT_BET_ENQUIRY"
	var err error
	var totalRecords int
	list := []model.ExportBetEnquiry{}

	logManager := logger.LogManager{}
	logManager.StartTask("Export Report Bet Enquiry", "Export", stampUser)
	logManager.WriteParameters(
		sql.Named("FromBetDate", fromBetDate),
		sql.Named("ToBetDate", toBetDate),
		sql.Named("FromBetID", fromBetID),
		sql.Named("ToBetID", toBetID),
		sql.Named("GameType", gameTypes),
		sql.Named("BetStatus", betStatus),
		sql.Named("SportID", sportIDs),
		sql.Named("MatchID", matchID),
		sql.Named("BranchID", branchID),
		sql.Named("BetAmtFrom", betAmtFrom),
		sql.Named("BetAmtTo", betAmtTo),
		sql.Named("Username", username),
		sql.Named("SwitchToMatchDate", switchToMatchDate),
		sql.Named("VoidUser", voidUser),
		sql.Named("BuyBack", buyback),
		sql.Named("TxnType", txnType),
		sql.Named("VIPFilter", vipFilter),
		sql.Named("Currency", currency),
		sql.Named("Product", product),
		// sql.Named("JackpotID", jackpotID),
		// sql.Named("LotteryID", lotteryID),
		// sql.Named("FromBetID_Lottery", fromBetIDLottery),
		// sql.Named("ToBetID_Lottery", toBetIDLottery),
		sql.Named("OrderBy", orderBy),
		sql.Named("HistOrPost", histOrPost),
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
	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return list, 0, err
	}
	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func ListExportMatchList(DateFrom, DateTo, SportIDs string, MatchID, LeagueID int, Category, AutoOdds, Status, OpenStatus, LiveStatus, HasLive, HasParlay, stampUser string) ([]model.ReportMatchList, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_XLS"
	var err error
	list := []model.ReportMatchList{}
	logManager := logger.LogManager{}
	logManager.StartTask("Get Report Match List", "Export", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", DateFrom),
		sql.Named("MatchDateTo", DateTo),
		sql.Named("SportID", SportIDs),
		sql.Named("MatchID", MatchID),
		sql.Named("LeagueID", LeagueID),
		sql.Named("Category", Category),
		sql.Named("AutoOdds", AutoOdds),
		sql.Named("Status", Status),
		sql.Named("MatchOpenStatus", OpenStatus),
		sql.Named("MatchLiveStatus", LiveStatus),
		sql.Named("MatchHasLiveStatus", HasLive),
		sql.Named("IsMatchHasParlay", HasParlay),
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
