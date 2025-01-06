package model

type PopularPicks struct {
	RowID        int    `json:"row_id" db:"RowID"`
	PickCategory string `json:"pick_category" db:"PickCategory"`
	MatchID      int    `json:"match_id" db:"MatchID"`
	SportID      int    `json:"sport_id" db:"SportID"`
	SportName    string `json:"sport_name" db:"SportName"`
	LeagueName   string `json:"league_name" db:"LeagueName"`
	HomeName     string `json:"home_name" db:"HomeName"`
	AwayName     string `json:"away_name" db:"AwayName"`
	MatchDate    string `json:"match_date" db:"Tgl_Tanding"`
	StampDate    string `json:"stamp_date" db:"StampDate"`
}

type PickCategories struct {
	PickCategory string `json:"pick_category" db:"PickCategory"`
}
