package model

type OddsLog struct {
	MatchID         int     `json:"match_id" db:"MatchID"`
	Line            int     `json:"line" db:"Line"`
	GameType        int     `json:"game_type" db:"GameType"`
	Market          string  `json:"market" db:"Market"`
	StampDate       string  `json:"stamp_date" db:"StampDate"`
	StampUser       string  `json:"stamp_user" db:"StampUser"`
	STFav           int     `json:"st_fav" db:"ST_Fav"`
	HDC             float32 `json:"handicap" db:"Hdc"`
	OddsHomeBefore  float32 `json:"odds_home_before" db:"OddsHomeBefore"`
	OddsHomeAfter   float32 `json:"odds_home_after" db:"OddsHomeAfter"`
	OddsAwayBefore  float32 `json:"odds_away_before" db:"OddsAwayBefore"`
	OddsAwayAfter   float32 `json:"odds_away_after" db:"OddsAwayAfter"`
	SourcePage      string  `json:"source_page" db:"SourcePage"`
	HomePosisi      int     `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi      int     `json:"away_posisi" db:"Away_Posisi"`
	EvRound         int     `json:"ev_round" db:"EvRound"`
	Status          string  `json:"status" db:"Status"`
	MatchTimer      string  `json:"match_timer" db:"MatchTimer"`
	MovePointTrader int     `json:"move_point_trader" db:"MovePoint_Trader"`
	RowID           int     `json:"row_id" db:"RowID"`
	StampDateOrder  string  `json:"stamp_date_order" db:"StampDate_Order"`
}
