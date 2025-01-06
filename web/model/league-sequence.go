package model

type LeagueSequence struct {
	NoEvents       int    `json:"no_events" db:"No_Events"`
	NamaEvents     string `json:"nama_events" db:"Nama_Events"`
	ParentLeagueID int    `json:"parent_league_id" db:"ParentLeagueID"`
	NoDisplay      int    `json:"no_display" db:"No_Display"`
	IsShowSpecial  string `json:"is_show_special" db:"IsShowSpecial"`
}
