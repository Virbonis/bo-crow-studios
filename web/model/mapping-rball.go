package model

type MappingRBallLeague struct {
	SportName     string `json:"sport_name" db:"Sport_Name"`
	RBLeagueID    int    `json:"rb_league_id" db:"RB_League_ID"`
	RBLeagueName  string `json:"rb_league_name" db:"RB_League_Name"`
	OurLeagueID   int    `json:"our_league_id" db:"Our_League_ID"`
	OurLeagueName string `json:"our_league_name" db:"Our_League_Name"`
	OurSportID    int    `json:"our_sport_id" db:"Our_Sport_ID"`
	OurLeague     string `json:"our_league" db:"Our_League"`
}

type MappingRBallTeam struct {
	SportName   string `json:"sport_name" db:"Sport_Name"`
	RBTeamID    int    `json:"rb_team_id" db:"RB_Team_ID"`
	RBTeamName  string `json:"rb_team_name" db:"RB_Team_Name"`
	OurTeamID   int    `json:"our_team_id" db:"Our_Team_ID"`
	OurTeamName string `json:"our_team_name" db:"Our_Team_Name"`
	OurSportID  int    `json:"our_sport_id" db:"Our_Sport_ID"`
	OurTeam     string `json:"our_team" db:"Our_Team"`
}

type MappingRBallMatch_League struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}
type MappingRBallMatch_LeagueRB struct {
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}
type MappingRBallMatch_Match struct {
	MatchID   int    `json:"match_id" db:"Match_ID"`
	MatchDate string `json:"match_date" db:"Match_Date"`
	HomeName  string `json:"home_name" db:"Home_Name"`
	AwayName  string `json:"away_name" db:"Away_Name"`
	MappingRBallMatch_MatchRB
}
type MappingRBallMatch_MatchRB struct {
	SportsTickerID int    `json:"sports_ticker_id" db:"SportsTickerID"`
	RBLeague       string `json:"rb_league" db:"League"`
	RBHomeName     string `json:"rb_home_name" db:"HomeTeam"`
	RBAwayName     string `json:"rb_away_name" db:"ForeignTeam"`
	RBMatchDate    string `json:"rb_match_date" db:"TimeStamp"`
	Booked         bool   `json:"booked" db:"Booked"`
}
