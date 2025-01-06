package model

type TraderDeadBall struct {
	SportName       string `json:"sport_name" db:"SportName"`
	LeagueName      string `json:"league_name" db:"LeagueName"`
	HomeTeamName    string `json:"home_team_name" db:"HomeTeamName"`
	AwayTeamName    string `json:"away_team_name" db:"AwayTeamName"`
	MatchDate       string `json:"match_date" db:"MatchDate"`
	Trader          string `json:"trader" db:"Trader"`
	UserTeamID      int    `json:"user_team_id" db:"UserTeam_ID"`
	UserTeamName    string `json:"user_team_name" db:"UserTeam_Name"`
	UserTeamSubID   int    `json:"user_team_sub_id" db:"UserTeamSub_ID"`
	UserTeamSubName string `json:"user_team_sub_name" db:"UserTeamSub_Name"`
	SpecialCode     string `json:"special_code" db:"SpecialCode"`
	SpecialName     string `json:"special_name" db:"SpecialName"`
}
