package model

import "github.com/guregu/null"

type MatchStatistic struct {
	MatchID         int         `json:"match_id" db:"Match_ID"`
	MatchDate       string      `json:"match_date" db:"Match_Date"`
	MatchCreateDate string      `json:"match_create_date" db:"Match_Create_Date"`
	LeagueName      string      `json:"league_name" db:"League_Name"`
	HomeName        string      `json:"home_name" db:"Home_Name"`
	AwayName        string      `json:"away_name" db:"Away_Name"`
	Trader          null.String `json:"trader" db:"Trader"`
	StatisticID     null.String `json:"statistic_id" db:"StatisticID"`
}
