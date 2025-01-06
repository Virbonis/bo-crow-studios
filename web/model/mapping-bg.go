package model

type MappingBGMatch_League struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}
type MappingBGMatch_LeagueBG struct {
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}

type MappingBGMatch_Match struct {
	MatchID   int    `json:"match_id" db:"Match_ID"`
	MatchDate string `json:"match_date" db:"Match_Date"`
	HomeName  string `json:"home_name" db:"Home_Name"`
	AwayName  string `json:"away_name" db:"Away_Name"`
	MappingBGMatch_MatchBG
}
type MappingBGMatch_MatchBG struct {
	SportsTickerID int    `json:"sports_ticker_id" db:"SportsTickerID"`
	BGLeague       string `json:"bg_league" db:"League"`
	BGHomeName     string `json:"bg_home_name" db:"HomeTeam"`
	BGAwayName     string `json:"bg_away_name" db:"ForeignTeam"`
	BGMatchDate    string `json:"bg_match_date" db:"TimeStamp"`
	Booked         bool   `json:"booked" db:"Booked"`
}

type BGGameEvent struct {
	LogEventID string `json:"log_event_id" db:"LogEventID"`
	LogDate    string `json:"log_date" db:"LogDate"`
	LogEvent   string `json:"log_event" db:"LogEvent"`
	HomeScore  string `json:"home_score" db:"HomeScore"`
	AwayScore  string `json:"away_score" db:"AwayScore"`
}
