package model

type OddsLog1x2 struct {
	MatchID   string `json:"match_id" db:"MatchID"`
	Market    string `json:"market" db:"Market"`
	GameType  string `json:"game_type" db:"GameType"`
	StampDate string `json:"stamp_date" db:"Date"`
	OddsHome  string `json:"odds_home" db:"OddsHome"`
	OddsDraw  string `json:"odds_draw" db:"OddsDraw"`
	OddsAway  string `json:"odds_away" db:"OddsAway"`
	StampUser string `json:"stamp_user" db:"StampUser"`
	AutoCalc  string `json:"auto_calc" db:"AutoCalc"`
}
