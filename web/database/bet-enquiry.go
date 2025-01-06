package database

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListBetEnquiry(fromBetDate, toBetDate, fromBetID, toBetID, gameTypes, betStatus, sportIDs string, matchID int, branchID string, betAmtFrom, betAmtTo int, username, switchToMatchDate, voidUser, orderBy string, currentPage, pageSize int, histOrPost, buyback, txnType string, vipFilter int, currency, product string, jackpotID, lotteryID int64, fromBetIDLottery, toBetIDLottery, stampUser string) ([]model.BetEnquiry, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_BET_ENQUIRY"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Enquiry", "BET ENQUIRY", stampUser)
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
		sql.Named("JackpotID", jackpotID),
		sql.Named("LotteryID", lotteryID),
		sql.Named("FromBetID_Lottery", fromBetIDLottery),
		sql.Named("ToBetID_Lottery", toBetIDLottery),
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

	list := []model.BetEnquiry{}
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

// func ExportBetEnquiry(fromBetDate, toBetDate, fromBetID, toBetID string, gameType int, betStatus string, sportID, matchID int, branchID string, betAmtFrom, betAmtTo int, username, switchToMatchDate, voidUser, orderBy string, currentPage, pageSize int, histOrPost, buyback, txnType string, vipFilter int, currency, product, stampUser string) ([]model.BetEnquiryExport, int, error) {
// 	dbName := Inetsoccer
// 	spName := "MGMT_SBA_RPT_EXPORT_BET_ENQUIRY"
// 	var err error
// 	var totalRecords int
// 	logManager := logger.LogManager{}
// 	logManager.StartTask("Export Bet Enquiry", "BET ENQUIRY", stampUser)
// 	logManager.WriteParameters(
// 		sql.Named("FromBetDate", fromBetDate),
// 		sql.Named("ToBetDate", toBetDate),
// 		sql.Named("FromBetID", fromBetID),
// 		sql.Named("ToBetID", toBetID),
// 		sql.Named("GameType", gameType),
// 		sql.Named("BetStatus", betStatus),
// 		sql.Named("SportID", sportID),
// 		sql.Named("MatchID", matchID),
// 		sql.Named("BranchID", branchID),
// 		sql.Named("BetAmtFrom", betAmtFrom),
// 		sql.Named("BetAmtTo", betAmtTo),
// 		sql.Named("Username", username),
// 		sql.Named("SwitchToMatchDate", switchToMatchDate),
// 		sql.Named("VoidUser", voidUser),
// 		sql.Named("OrderBy", orderBy),
// 		sql.Named("CurrentPage", currentPage),
// 		sql.Named("PageSize", pageSize),
// 		sql.Named("HistOrPost", histOrPost),
// 		sql.Named("BuyBack", buyback),
// 		sql.Named("TxnType", txnType),
// 		sql.Named("VIPFilter", vipFilter),
// 		sql.Named("Currency", currency),
// 		sql.Named("Product", product),
// 		sql.Named("StampUser", stampUser),
// 		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
// 	)
// 	defer func() {
// 		if err != nil {
// 			logManager.WriteStatusError(err.Error())
// 			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
// 		}
// 		go logManager.EndTask()
// 	}()
// 	list := []model.BetEnquiryExport{}
// 	rows, err := sqlConnections.conn[dbName].Queryx(spName, logManager.Parameters...)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
// 		return nil, 0, err
// 	}
// 	defer rows.Close()
// 	err = sqlx.StructScan(rows, &list)
// 	if err != nil {
// 		log.Warnf("[mssql] Failed reading rows: %v", err)
// 		return nil, 0, err
// 	}
// 	if sqlConnections.Verbose {
// 		log.Debugf("[mssql] EXEC %v", spName)
// 	}
// 	return list, totalRecords, nil
// }

func ListBetEnquiryParlayCombo(noTxn int, stampUser string) ([]model.BetEnquiryParlayCombo, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_PARLAY_COMBO_BET_ENQUIRY"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Enquiry Parlay Combo", "BET ENQUIRY", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Txn", noTxn),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetEnquiryParlayCombo{}
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
func ListBetEnquiryLottery(noTxn int, stampUser string) ([]model.BetEnquiryLottery, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_LOTTERY_MATCH_BET_ENQUIRY_2"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Enquiry Lottery", "BET ENQUIRY", stampUser)
	logManager.WriteParameters(
		sql.Named("No_Txn", noTxn),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetEnquiryLottery{}
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

func ListBetEnquiryResult(betID, gameType int, stampUser string) ([]model.BetEnquiryResult, error) {
	dbName := Inetsoccer
	var spName string
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Bet Enquiry Pop Up Result", "Bet Enquiry", stampUser)

	switch gameType {
	case 77:
		spName = "MGMT_SBA_GET_BET_ENQUIRY_VS_DETAIL"
	case 4000:
		spName = "MGMT_SBA_GET_BET_ENQUIRY_RESULT_SPORTSLOTTERY"
	default:
		spName = "MGMT_SBA_GET_BET_ENQUIRY_RESULT"
	}

	logManager.WriteParameters(
		sql.Named("BetID", betID),
		sql.Named("StampUser", stampUser),
	)

	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.BetEnquiryResult{}
	// Unsafe for escaping unused select columns (e.g. Status7, Margin)
	rows, err := sqlConnections.conn[dbName].Unsafe().Queryx(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	err = sqlx.StructScan(rows, &list)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}
func GetBetEnquiryResultBetBuilder(betID int, stampUser string) (*model.BetEnquiryResultBetBuilder, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_GET_BET_ENQUIRY_RESULT_BETBUILDER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Get Bet Enquiry Pop Up Result Bet Builder", "BET ENQUIRY", stampUser)
	logManager.WriteParameters(
		sql.Named("BetID", betID),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	var model model.BetEnquiryResultBetBuilder
	err = sqlConnections.conn[dbName].QueryRow(spName, logManager.Parameters...).Scan(
		&model.MarketName,
		&model.Result,
	)
	if err != nil {
		log.Warnf("[mssql] Failed reading rows: %v", err)
		return nil, err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return &model, nil
}

func UpdateBetEnquiry(betIDs, cancelType string, voidID int, voidDesc, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_TICKET_BET_ENQUIRY"
	var err error
	var result string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Ticket", "BET ENQUIRY", stampUser)
	logManager.WriteParameters(
		sql.Named("BetIDs", betIDs),
		sql.Named("CancelType", cancelType),
		sql.Named("VoidID", voidID),
		sql.Named("VoidDesc", voidDesc),
		sql.Named("StampUser", stampUser),
		sql.Named("Result", sql.Out{Dest: &result}),
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

	if result != "" {
		var errMessage string
		for _, s := range strings.Split(result, ",") {
			val := strings.Split(s, "^")
			errMessage += val[0] + " - " + val[2] + "\n"
		}
		return errors.New(fmt.Sprintf("Ticket : \n%v", errMessage))
	}
	return err
}
