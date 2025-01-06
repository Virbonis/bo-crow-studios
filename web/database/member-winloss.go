package database

import (
	"database/sql"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListMemberWinloss(glDateFrom, glDateTo, username, branchId string, userTeam, vipCode int, param2, param3, param4, param5, orderBy, histOrPost string, matchId, gameType int, stLive, sportId string,
	leagueId, userTeamId int, currency, txnType string, currentPage, pageSize int, product, reportType, stampUser string) ([]model.MemberWinloss, *model.MemberWinlossHeader, int, error) {
	dbName := Inetsoccer
	var spName string
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Member Winloss", "Member Winloss", stampUser)

	switch strings.ToLower(reportType) {
	case "sport":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_2"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
		)
	case "league":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_3"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
		)
	case "match":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_4"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("TxnType", txnType),
		)
	case "gametype":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_5"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Param5", param5),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("TxnType", txnType),
		)
	default:
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("BranchID", branchId),
			sql.Named("Username", username),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("SportID", sportId),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("StampUser", stampUser),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("MatchID", matchId),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Product", product),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
		)
	}

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MemberWinloss{}
	header := model.MemberWinlossHeader{}
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
		err = rows.StructScan(&header)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, nil, 0, err
		}
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, &header, totalRecords, nil
}

func ListMemberWinlossDetail(glDateFrom, glDateTo, username, branchId string, userTeam, vipCode int, param2, param3, param4, param5, orderBy, histOrPost string, matchId, gameType int, stLive, sportId string,
	leagueId, userTeamId int, currency, txnType string, currentPage, pageSize int, product, reportType, stampUser string) ([]model.MemberWinlossDetail, *model.MemberWinlossDetailSummary, int, error) {
	dbName := Inetsoccer
	var spName string
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Member Winloss Detail", "Member Winloss", stampUser)

	switch strings.ToLower(reportType) {
	case "sport":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_DETAIL_2"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		)
	case "league":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_DETAIL_3"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("TxnType", txnType),
		)
	case "match":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_DETAIL_4"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Param5", param5),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("TxnType", txnType),
		)
	case "gametype":
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_DETAIL_4"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("Param3", param3),
			sql.Named("Param4", param4),
			sql.Named("Param5", param5),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("TxnType", txnType),
		)
	default:
		spName = "MGMT_SBA_RPT_MEMBER_WINLOSS_DETAIL"
		logManager.WriteParameters(
			sql.Named("GLDateFrom", glDateFrom),
			sql.Named("GLDateTo", glDateTo),
			sql.Named("Username", username),
			sql.Named("MatchID", matchId),
			sql.Named("BranchID", branchId),
			sql.Named("SportID", sportId),
			sql.Named("GameType", gameType),
			sql.Named("Currency", currency),
			sql.Named("VIPCode", vipCode),
			sql.Named("STLive", stLive),
			sql.Named("Param2", param2),
			sql.Named("HistOrPost", histOrPost),
			sql.Named("OrderBy", orderBy),
			sql.Named("CurrentPage", currentPage),
			sql.Named("PageSize", pageSize),
			sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
			sql.Named("UserTeamID", userTeamId),
			sql.Named("StampUser", stampUser),
			sql.Named("Product", product),
			sql.Named("LeagueID", leagueId),
			sql.Named("TxnType", txnType),
		)
	}

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MemberWinlossDetail{}
	summary := model.MemberWinlossDetailSummary{}
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
