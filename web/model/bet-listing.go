package model

type BetListingLeague struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}

type BetListingMatch struct {
	Mat        int    `json:"match_id" db:"Match_ID"`
	LeagueName string `json:"team" db:"Team"`
}
