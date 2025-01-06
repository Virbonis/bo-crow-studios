package model

import "github.com/guregu/null"

type MappingGLive_League struct {
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}
type MappingGLive_LeagueGL struct {
	GLeague string `json:"g_league" db:"GLeague"`
}
type MappingGLive_Match struct {
	MatchID   int    `json:"match_id" db:"MatchID"`
	MatchDate string `json:"match_date" db:"MatchDate"`
	HomeName  string `json:"home_name" db:"HomeName"`
	AwayName  string `json:"away_name" db:"AwayName"`
	IsLive    bool   `json:"is_live" db:"IsLive"`
	MappingGLive_MatchGL
}
type MappingGLive_MatchGL struct {
	GMatchID   null.Int    `json:"g_match_id" db:"GMatchID"`
	GLeague    null.String `json:"g_league" db:"GLeague"`
	GMatchDate null.String `json:"g_match_date" db:"GMatchDate"`
	GHomeName  null.String `json:"g_home_name" db:"GHomeTeam"`
	GAwayName  null.String `json:"g_away_name" db:"GAwayTeam"`
}
