package model

type MasterLeagueGroup struct {
	SportID     int    `json:"sport_id" db:"No_Sport"`
	LeagueGroup string `json:"league_group" db:"LeagueGroup"`
}
