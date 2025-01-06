package model

type LeagueDuplicateMatch struct {
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}

type SearchLeagueDuplicateMatch struct {
	SportID    int    `json:"sport_id" db:"SportID"`
	SportName  string `json:"sport_name" db:"SportName"`
	LeagueID   int    `json:"league_id" db:"LeagueID"`
	LeagueName string `json:"league_name" db:"LeagueName"`
}
