package model

type MappingBB struct {
	MatchID        int    `json:"match_id" db:"Match_ID"`
	MatchDate      string `json:"match_date" db:"Match_Date"`
	LeagueName     string `json:"league_name" db:"League_Name"`
	HomeName       string `json:"home_name" db:"Home_Name"`
	AwayName       string `json:"away_name" db:"Away_Name"`
	SportsTickerID int    `json:"sports_ticker_id" db:"SportsTickerId"`
	BBMatchID      string `json:"bb_match_id" db:"BB_Match_ID"`
	BBLeagueName   string `json:"bb_league_name" db:"BB_League_Name"`
	BBHomeName     string `json:"bb_home_name" db:"BB_Home_Name"`
	BBAwayName     string `json:"bb_away_name" db:"BB_Away_Name"`
	BBStatus       string `json:"bb_status" db:"BB_Status"`
}
