package database

import (
	"database/sql"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	log "github.com/sirupsen/logrus"
)

func ListMatchStatistic(dateFrom, dateTo string, matchId, sportId, leagueId int, orderBy string, currentPage, pageSize int, stampUser string) ([]model.MatchStatistic, int, error) {
	dbName := Inetsoccer
	spName := "MGMT_SBA_LIST_GRID_MATCH_STATISTIC"
	var err error
	var totalRecords int

	logManager := logger.LogManager{}
	logManager.StartTask("List Match Statistic", "Match List Grid Match Statistic", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchDateFrom", dateFrom),
		sql.Named("MatchDateTo", dateTo),
		sql.Named("MatchID", matchId),
		sql.Named("SportID", sportId),
		sql.Named("LeagueID", leagueId),
		sql.Named("OrderBy", orderBy),
		sql.Named("CurrentPage", currentPage),
		sql.Named("PageSize", pageSize),
		sql.Named("TotalRecords", sql.Out{Dest: &totalRecords}),
		sql.Named("StampUser", stampUser),
	)
	defer func() {
		if err != nil {
			logManager.WriteStatusError(err.Error())
			go InsertLogError(dbName, spName, logManager.Parameters, err.Error(), stampUser)
		}
		go logManager.EndTask()
	}()

	list := []model.MatchStatistic{}
	rows, err := sqlConnections.conn[dbName].Query(spName, logManager.Parameters...)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return nil, 0, err
	}
	defer rows.Close()

	for rows.Next() {
		model := model.MatchStatistic{}
		err := rows.Scan(
			&model.MatchID,
			&model.MatchDate,
			&model.MatchCreateDate,
			&model.LeagueName,
			&model.HomeName,
			&model.AwayName,
			&model.Trader,
			&model.StatisticID,
		)
		if err != nil {
			log.Warnf("[mssql] Failed reading rows: %v", err)
			return nil, 0, err
		}
		list = append(list, model)
	}

	if sqlConnections.Verbose {
		log.Debugf("[mssql] EXEC %v", spName)
	}
	return list, totalRecords, nil
}

func UpdateMatchStatistic(matchID int, statisticId, stampUser string) error {
	dbName := Inetsoccer
	spName := "MGMT_SBA_PROC_UPD_MATCH_STATISTIC"
	var err error

	logManager := logger.LogManager{}
	logManager.StartTask("Update Match Statistic", "MATCH STATISTIC", stampUser)
	logManager.WriteParameters(
		sql.Named("MatchID", matchID),
		sql.Named("StatisticID", statisticId),
		sql.Named("StampUser", stampUser),
	)
	logManager.SetMatchIDorCustName(matchID)
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
