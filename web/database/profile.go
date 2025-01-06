package database

import (
	"database/sql"
	"errors"
	"fmt"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	mssql "github.com/denisenkom/go-mssqldb"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

func ListSelectProfile(stampUser string) ([]model.ProfileSelect, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Select Profile", "Master Profile", stampUser)
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

	list := []model.ProfileSelect{}
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

func ListProfile(profileID, soccerOS, stampUser string) ([]model.EventLimit, []model.Payout, []model.PayoutSpec, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_PROFILE"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Profile", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("StampUser", stampUser),
		sql.Named("SoccerOS", soccerOS),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	listEvent := []model.EventLimit{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, nil, nil, err
	}
	defer rows.Close()

	for rows.Next() {
		modelA := model.EventLimit{}
		err := rows.Scan(
			&modelA.GameType_Sequence,
			&modelA.GameType,
			&modelA.Step_1,
			&modelA.Odds_Trigger_1,
			&modelA.Max_Limit_1,
			&modelA.Max_Bet_1,
			&modelA.Spread_1,
			&modelA.Step_2,
			&modelA.Odds_Trigger_2,
			&modelA.Max_Limit_2,
			&modelA.Max_Bet_2,
			&modelA.Spread_2,
			&modelA.Step_3,
			&modelA.Odds_Trigger_3,
			&modelA.Max_Limit_3,
			&modelA.Max_Bet_3,
			&modelA.Spread_3,
			&modelA.Step_4,
			&modelA.Odds_Trigger_4,
			&modelA.Max_Limit_4,
			&modelA.Max_Bet_4,
			&modelA.Spread_4,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, nil, nil, err
		}
		listEvent = append(listEvent, modelA)
	}

	rows.NextResultSet()
	listPayout := []model.Payout{}
	for rows.Next() {
		modelB := &model.Payout{}
		err := rows.Scan(
			&modelB.League_Profile,
			&modelB.GameType,
			&modelB.Max_Bet,
			&modelB.Max_Payout,
			&modelB.Spread,
			&modelB.Is_Live,
			&modelB.LAP,
			&modelB.Amount_Trigger,
			&modelB.Max_Payout_Ticket,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return listEvent, nil, nil, err
		}
		listPayout = append(listPayout, *modelB)
	}

	rows.NextResultSet()
	listPayoutSpec := []model.PayoutSpec{}
	for rows.Next() {
		modelC := &model.PayoutSpec{}
		err := rows.Scan(
			&modelC.League_Profile,
			&modelC.GameTypeSpec,
			&modelC.Max_PayoutSpec,
			&modelC.SpreadSpec,
			&modelC.IS_LiveSpec,
			&modelC.LAPSpec,
			&modelC.Max_BetSpec,
			&modelC.Amount_TriggerSpec,
			&modelC.No_Display,
			&modelC.Max_PayoutSpec_Ticket,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return listEvent, listPayout, nil, err
		}
		listPayoutSpec = append(listPayoutSpec, *modelC)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return listEvent, listPayout, listPayoutSpec, nil
}

func CreateMasterProfile(profileID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_PROFILE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Profile", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
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

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Unable Insert - Profile already exist")
		return errors.New("Unable Insert - Profile already exist")
	}
	return err
}

func DeleteProfile(profileID, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_PROFILE"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Profile", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
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

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Can't Delete Default Profile")
		return errors.New("Can't Delete Default Profile")
	} else if rs == -2 {
		logManager.WriteStatusError("Profile is in Use by League")
		return errors.New("Profile is in Use by League")
	} else if rs == -3 {
		logManager.WriteStatusError("Profile is in Use by Match")
		return errors.New("Profile is in Use by Match")
	}
	return err
}

func UpdateMasterProfile(profileID, marketGroup string, gameType, gameTypeSequence, step int, oddsTrigger, maxLimit, maxBet, spread *float32, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_PROFILE"
	var err error
	var ErrMessage string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Profile", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
		sql.Named("GameTypeSeq", gameTypeSequence),
		sql.Named("MarketGroup", marketGroup),
		sql.Named("Step", step),
		sql.Named("OddsTrigger", oddsTrigger),
		sql.Named("MaxLimit", maxLimit),
		sql.Named("MaxBet", maxBet),
		sql.Named("Spread", spread),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", sql.Out{Dest: &ErrMessage}),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "MsEventLimit",
		fmt.Sprintf("%v,%v,%v", profileID, gameType, gameTypeSequence),
		[]string{"LimitID", "GameType", "GameTypeNo"})
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
	if ErrMessage != "" {
		return errors.New(ErrMessage)
	}
	return err
}

func UpdateProfilePayout(profileID string, gameType *int, maxPayout, maxPayoutLive, maxPayoutTicket, maxPayoutTicketLive, maxBet, maxBetLive, amountTrigger, amountTriggerLive *float32, spread, spreadLive *float32, isLive string, lap, lapLive *float32, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_PROFILE_PAYOUT"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Profile Payout", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
		sql.Named("MaxPayout", maxPayout),
		sql.Named("MaxPayoutLive", maxPayoutLive),
		sql.Named("MaxPayoutTicket", maxPayoutTicket),
		sql.Named("MaxPayoutTicketLive", maxPayoutTicketLive),
		sql.Named("MaxBet", maxBet),
		sql.Named("MaxBetLive", maxBetLive),
		sql.Named("AmountTrigger", amountTrigger),
		sql.Named("AmountTriggerLive", amountTriggerLive),
		sql.Named("Spread", spread),
		sql.Named("SpreadLive", spreadLive),
		sql.Named("IsLive", isLive),
		sql.Named("LAP", lap),
		sql.Named("LAPLive", lapLive),
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

func ListProfileOddsTrigger(profileId string, gameType int, stampUser string) ([]model.ProfileOddsTrigger, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MASTER_PROFILE_ODDS_TRIGGER"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("List Profile Odds Trigger", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileId),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.ProfileOddsTrigger{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		model := model.ProfileOddsTrigger{}
		err := rows.Scan(
			&model.LimitID,
			&model.GameType,
			&model.OddsTriggerID,
			&model.OddsFrom,
			&model.OddsTo,
			&model.OddsTriggerPercent,
		)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return nil, err
		}
		list = append(list, model)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, nil
}

func InsertOddsTrigger(profileId string, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_INS_MASTER_PROFILE_ODDS_TRIGGER"
	var err error
	var ErrMessage string
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Insert Odds Trigger", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileId),
		sql.Named("GameType", gameType),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", sql.Out{Dest: &ErrMessage}),
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

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	if rs == -1 {
		logManager.WriteStatusError("Unable Insert - Odds Trigger already exist")
		return errors.New("Unable Insert - Odds Trigger already exist")
	}
	if ErrMessage != "" {
		return errors.New(ErrMessage)
	}
	return err
}

func UpdateOddsTrigger(profileID string, gameType, oddsTriggerId int, oddsTriggerPercent, oddsTo *float32, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MASTER_PROFILE_ODDS_TRIGGER"
	var err error
	var ErrMessage string

	logManager := logger.LogManager{}
	logManager.StartTask("Update Odds Trigger", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
		sql.Named("OddsTriggerID", oddsTriggerId),
		sql.Named("OddsTo", oddsTo),
		sql.Named("OddsTriggerPercent", oddsTriggerPercent),
		sql.Named("StampUser", stampUser),
		sql.Named("ErrMessage", &ErrMessage),
	)
	logManager.PrepareAudit(sqlConnections.conn[dbName], "MsEventLimit_OddsTrigger",
		fmt.Sprintf("%v,%v,%v,%v,%v", profileID, gameType, oddsTriggerId, oddsTo, oddsTriggerPercent),
		[]string{"ProfileID", "GameType", "OddsTriggerID", "OddsTo", "OddsTriggerPercent"})
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
	if ErrMessage != "" {
		return errors.New(ErrMessage)
	}
	return err
}

func DeleteOddsTrigger(profileID string, gameType int, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_DEL_MASTER_PROFILE_ODDS_TRIGGER"
	var err error
	var rs mssql.ReturnStatus

	logManager := logger.LogManager{}
	logManager.StartTask("Delete Odds Trigger", "Master Profile", stampUser)
	logManager.WriteParameters(
		sql.Named("ProfileID", profileID),
		sql.Named("GameType", gameType),
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

	_, err = sqlConnections.conn[dbName].Exec(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return err
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return nil
}
