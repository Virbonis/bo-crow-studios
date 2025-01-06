package model

type ListKnockouts struct {
	RowID             int    `json:"row_id" db:"RowID"`
	KnockoutsCategory string `json:"category" db:"KnockoutsCategory"`
	KnockoutsID       int    `json:"knockouts_id" db:"KnockoutsID"`
	TeamID1           int    `json:"team_id_1" db:"TeamID1"`
	TeamID2           int    `json:"team_id_2" db:"TeamID2"`
	MatchDate         string `json:"match_date" db:"MatchDate"`
	HomeName          string `json:"home_name" db:"HomeName"`
	AwayName          string `json:"away_name" db:"AwayName"`
	KnockoutsRounds   int    `json:"knockouts_round" db:"KnockoutsRound"`
	Result            string `json:"result" db:"Results"`
	ResultsState      string `json:"results_state" db:"Results_State"`
}

type KnockoutsCategory struct {
	KnockoutsCategory string `json:"knockouts_category" db:"KnockoutsCategory"`
	RedisCategory     string `json:"redis_category" db:"RedisCategory"`
}
