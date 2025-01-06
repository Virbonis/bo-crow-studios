package database

import (
	"database/sql"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBreakdownWinloss(glDateFrom, glDateTo, branchId string, userTeam, draw int, histOrPost string, matchId, gameType int, stLive string, sportId, leagueId, includeMemberCount int, specialMatch string,
	userTeamId int, currency, txnType, competition string, priceGroup int, product, reportType, stampUser string) ([]model.BreakdownWinloss, []model.BreakdownParlay, []model.BreakdownParlay, int, error) {
	dbName := Inetsoccer
	var spName string
	var err error
	var totalMemberCount int

	logManager := logger.LogManager{}
	logManager.StartTask("List Breakdown Winloss", "Breakdown Winloss", stampUser)

	switch strings.ToLower(reportType) {
	case "branch":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BRANCH"
	case "sport":
		spName = "MGMT_SBA_RPT_BREAKDOWN_SPORT"
	case "league":
		spName = "MGMT_SBA_RPT_BREAKDOWN_LEAGUE"
	case "match":
		spName = "MGMT_SBA_RPT_BREAKDOWN_MATCH"
	case "gametype":
		spName = "MGMT_SBA_RPT_BREAKDOWN_GAMETYPE"
	case "month":
		spName = "MGMT_SBA_RPT_BREAKDOWN_MONTH"
	case "date":
		spName = "MGMT_SBA_RPT_BREAKDOWN_DATE"
	case "currency":
		spName = "MGMT_SBA_RPT_BREAKDOWN_CURRENCY"
	case "parlay":
		spName = "MGMT_SBA_RPT_BREAKDOWN_PARLAY"
	case "special":
		spName = "MGMT_SBA_RPT_BREAKDOWN_SPECIAL"
	case "platform":
		spName = "MGMT_SBA_RPT_BREAKDOWN_PLATFORM"
	}

	switch spName {
	case "MGMT_SBA_RPT_BREAKDOWN_MATCH":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("Draw", draw),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
			sql.Named("Competition", competition),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Product", product),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_PARLAY":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("STLive", stLive),
			sql.Named("TxnType", txnType),
			sql.Named("Competition", competition),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Product", product),
			sql.Named("StampUser", stampUser),
		)
	default:
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("Draw", draw),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("TxnType", txnType),
			sql.Named("Competition", competition),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Product", product),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	}

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BreakdownWinloss{}
	listSingleParlay := []model.BreakdownParlay{}
	listComboParlay := []model.BreakdownParlay{}
	// Unsafe for escaping unused select columns (e.g. Status7, Margin)
	rows, err := sqlConnections.conn[dbName].Unsafe().Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, 0, err
	}
	defer rows.Close()

	if spName == "MGMT_SBA_RPT_BREAKDOWN_PARLAY" {
		err = sqlx.StructScan(rows, &listSingleParlay)
		if err != nil {
			log.Warnf("[mssql] Failed executing stored procedure: %v", err)
			return nil, nil, nil, 0, err
		}
		rows.NextResultSet()
		err = sqlx.StructScan(rows, &listComboParlay)
		if err != nil {
			log.Warnf("[mssql] Failed executing stored procedure: %v", err)
			return nil, nil, nil, 0, err
		}

		return nil, listSingleParlay, listComboParlay, 0, nil
	}

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil, nil, totalMemberCount, nil
}

func ListBreakdownWinlossUT(glDateFrom, glDateTo, branchId string, userTeam, draw, fidUserTeam int, histOrPost string, matchId, gameType int, stLive string, sportId, leagueId, includeMemberCount int,
	specialMatch string, userTeamId, param2, param3, param4, param5, userTeamSubId int, currency, txnType, competition string, priceGroup int,
	product, reportType, stampUser string) ([]model.BreakdownWinloss, *model.BreakdownWinlossUTHeader, int, error) {
	dbName := Inetsoccer
	var spName string
	var err error
	var totalMemberCount int

	logManager := logger.LogManager{}
	logManager.StartTask("List Breakdown Win Loss", "Master Breakdown Win Loss", stampUser)

	switch strings.ToLower(reportType) {
	case "userteamsub":
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM_2"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	case "trader":
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM_3"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	case "league":
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM_4"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	case "match":
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM_5"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	case "gametype":
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM_6"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Param5", param5),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	default:
		spName = "MGMT_SBA_RPT_BREAKDOWN_USER_TEAM"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("UserTeam", userTeam),
			sql.Named("GameType", gameType),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("Draw", draw),
			sql.Named("STLive", stLive),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("MatchID", matchId),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("UserTeamSubID", userTeamSubId),
			sql.Named("StampUser", stampUser),
			sql.Named("Competition", competition),
			sql.Named("IncludeMemberCount", includeMemberCount),
			sql.Named("Product", product),
			sql.Named("TotalMemberCount", sql.Out{Dest: &totalMemberCount}),
		)
	}

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	header := model.BreakdownWinlossUTHeader{}
	list := []model.BreakdownWinloss{}
	// Unsafe for escaping unused select columns (e.g. Status7, Margin)
	rows, err := sqlConnections.conn[dbName].Unsafe().Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		err = rows.StructScan(&header)
		if err != nil {
			log.Warnf("[mssql] Failed executing stored procedure: %v", err)
			return nil, nil, 0, err
		}
	}

	rows.NextResultSet()
	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, 0, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, &header, totalMemberCount, nil
}

func ListBreakdownWinlossBetDetail(glDateFrom, glDateTo, branchId string, userTeam, draw, fidUserTeam int, histOrPost string, matchId, gameType int, stLive string, sportId, leagueId int,
	userTeamId, param2, param3, param4, param5, userTeamSubId int, currency, txnType, competition string, priceGroup, currentPage, pageSize int,
	product, reportType, specialMatch, orderBy, stampUser string) ([]model.BreakdownWinlossBetDetail, *model.BreakdownWinlossBetDetailSummary, int, error) {
	dbName := Inetsoccer
	var spName string
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Breakdown WinLoss Bet Detail", "Breakdown WinLoss", stampUser)

	switch strings.ToLower(reportType) {
	case "branch":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_BRANCH"
	case "userteam":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM"
	case "userteamsub":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_2"
	case "userteam_trader":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_3"
	case "userteam_league":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_4"
	case "userteam_match":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_5"
	case "userteam_gametype":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_6"
	case "sport":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_SPORT"
	case "league":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_LEAGUE"
	case "match":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_MATCH"
	case "gametype":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_GAMETYPE"
	case "month":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_MONTH"
	case "date":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_DATE"
	case "currency":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_CURRENCY"
	case "special":
		spName = "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_SPECIAL"
	}

	switch spName {
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_LEAGUE":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("LeagueID", leagueId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("TxnType", txnType),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_CURRENCY":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("TxnType", txnType),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_2":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("Param2", param2),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_3":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_4":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_5", "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM_6":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Param5", param5),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_SPECIAL":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("TxnType", txnType),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_USER_TEAM":
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("SportID", sportId),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("FID_User_Team", fidUserTeam),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	default:
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Draw", draw),
			sql.Named("UserTeam", userTeam),
			sql.Named("MatchID", matchId),
			sql.Named("GameType", gameType),
			sql.Named("STLive", stLive),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("SpecialMatch", specialMatch),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("Currency", currency),
			sql.Named("TxnType", txnType),
			sql.Named("PriceGroup", priceGroup),
			sql.Named("Competition", competition),
			sql.Named("Product", product),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("StampUser", stampUser),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	}

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BreakdownWinlossBetDetail{}
	summary := model.BreakdownWinlossBetDetailSummary{}
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
	return list, &summary, totalRecords, nil
}

func ListExportBreakdownWinlossBetDetailDate(glDateFrom, glDateTo, branchID string, draw, userTeam, matchID, gameType int, stLive string, sportID int, orderBy, specialMatch, currency, txnType string, priceGroup int, competition, product string, currentPage, pageSize int, histOrPost string, userTeamID int, stampUser string) ([]model.BreakdownWinlossBetDetailDateExport, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_RPT_BREAKDOWN_BET_DETAIL_DATE_EXPORT"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Export Breakdown Win Loss Bet Detail", "Breakdown Win Loss", stampUser)
	logManager.WriteParameters(
		sql.Named("GLDateFrom", glDateFrom),
		sql.Named("GLDateTo", glDateTo),
		sql.Named("BranchID", branchID),
		sql.Named("Draw", draw),
		sql.Named("UserTeam", userTeam),
		sql.Named("MatchID", matchID),
		sql.Named("GameType", gameType),
		sql.Named("STLive", stLive),
		sql.Named("SportID", sportID),
		sql.Named("OrderBy", orderBy),
		sql.Named("SpecialMatch", specialMatch),
		sql.Named("Currency", currency),
		sql.Named("TxnType", txnType),
		sql.Named("PriceGroup", priceGroup),
		sql.Named("Competition", competition),
		sql.Named("Product", product),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("HistOrPost", histOrPost),
		sql.Named("UserTeamID", userTeamID),
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

	list := []model.BreakdownWinlossBetDetailDateExport{}
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
