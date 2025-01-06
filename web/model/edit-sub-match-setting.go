package model

import "github.com/shopspring/decimal"

type SubMatchSetting struct {
	OddsSpread           int     `json:"odds_spread" db:"Odds_Spread"`
	ShiftLeeching        int     `json:"shift_leeching" db:"Shift_Leeching"`
	FollowLeeching       string  `json:"follow_leeching" db:"Follow_Leeching"`
	LockLeeching         int     `json:"lock_leeching" db:"Lock_Leeching"`
	AutoPause            int     `json:"auto_pause" db:"Auto_Pause"`
	LapLong              float64 `json:"lap_long" db:"LAP_Long"`
	LapShort             float64 `json:"lap_short" db:"LAP_Short"`
	CAPLong              float64 `json:"cap_long" db:"CAP_Long"`
	CAPShort             float64 `json:"cap_short" db:"CAP_Short"`
	SubMatchParlayStatus int     `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	SubMatchPauseStatus  int     `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	ShowAutoOdds         string  `json:"show_auto_odds" db:"Show_Auto_Odds"`
	Odds1                float64 `json:"odds1" db:"Odds1"`
	Odds2                float64 `json:"odds2" db:"Odds2"`
	Odds3                float64 `json:"odds3" db:"Odds3"`
	Odds4                float64 `json:"odds4" db:"Odds4"`
	Odds5                float64 `json:"odds5" db:"Odds5"`
	Odds6                float64 `json:"odds6" db:"Odds6"`
	Odds7                float64 `json:"odds7" db:"Odds7"`
	Odds8                float64 `json:"odds8" db:"Odds8"`
	Odds9                float64 `json:"odds9" db:"Odds9"`
	Odds10               float64 `json:"odds10" db:"Odds10"`
	Odds11               float64 `json:"odds11" db:"Odds11"`
	Odds12               float64 `json:"odds12" db:"Odds12"`
	Odds13               float64 `json:"odds13" db:"Odds13"`
	Odds14               float64 `json:"odds14" db:"Odds14"`
	Odds15               float64 `json:"odds15" db:"Odds15"`
	Odds16               float64 `json:"odds16" db:"Odds16"`
	Odds17               float64 `json:"odds17" db:"Odds17"`
	Odds18               float64 `json:"odds18" db:"Odds18"`
	Odds19               float64 `json:"odds19" db:"Odds19"`
	Odds20               float64 `json:"odds20" db:"Odds20"`
	Odds21               float64 `json:"odds21" db:"Odds21"`
	Odds22               float64 `json:"odds22" db:"Odds22"`
	Odds23               float64 `json:"odds23" db:"Odds23"`
	Odds24               float64 `json:"odds24" db:"Odds24"`
	Odds25               float64 `json:"odds25" db:"Odds25"`
	Odds26               float64 `json:"odds26" db:"Odds26"`
	Odds27               float64 `json:"odds27" db:"Odds27"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float64 `json:"odds_margin" db:"OddsMargin"`
}

type SubMatchOutrightSetting struct {
	OutrightID          int             `json:"outright_id" db:"Outright_ID"`
	OutrightDate        string          `json:"outright_date" db:"Outright_Date"`
	TeamName            string          `json:"team_name" db:"Team_Name"`
	SubMatchID          int             `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchSeq         int             `json:"sub_match_seq" db:"Sub_Match_Seq"`
	SubMatchOpenStatus  string          `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchPauseStatus string          `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	Odds                decimal.Decimal `json:"odds" db:"Odds"`
	PriceStep           float64         `json:"price_step" db:"Price_Step"`
	AutoOdds            int             `json:"auto_odds" db:"Auto_Odds"`
	LockShift           int             `json:"lock_shift" db:"Lock_Shift"`
	AutoPause           int             `json:"auto_pause" db:"Auto_Pause"`
	IsMatchConfirmed    string          `json:"is_match_confirmed" db:"Is_Match_Confirmed"`
}

type SubMatchSpecialSettingDesc struct {
	MatchID    int    `json:"match_id" db:"Match_ID"`
	GameType   int    `json:"game_type" db:"GameType"`
	GameName   string `json:"game_name" db:"GameName"`
	SportName  string `json:"sport_name" db:"Sport_Name"`
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
	HomeName   string `json:"home_name" db:"Home_Name"`
	AwayName   string `json:"away_name" db:"Away_Name"`
}

type SubMatchSpecialSetting struct {
	MatchID              int     `json:"match_id" db:"Match_ID"`
	GameType             int     `json:"game_type" db:"GameType"`
	MaxPayout            float64 `json:"max_payout" db:"MaxPayout"`
	Odds1                float64 `json:"odds1" db:"Odds1"`
	Odds2                float64 `json:"odds2" db:"Odds2"`
	Odds3                float64 `json:"odds3" db:"Odds3"`
	Odds4                float64 `json:"odds4" db:"Odds4"`
	Odds5                float64 `json:"odds5" db:"Odds5"`
	Odds6                float64 `json:"odds6" db:"Odds6"`
	Odds7                float64 `json:"odds7" db:"Odds7"`
	Odds8                float64 `json:"odds8" db:"Odds8"`
	Odds9                float64 `json:"odds9" db:"Odds9"`
	Odds10               float64 `json:"odds10" db:"Odds10"`
	Handicap             float64 `json:"handicap" db:"Handicap"`
	SubMatchParlayStatus string  `json:"sub_match_parlay_status" db:"Sub_Match_Parlay_Status"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float64 `json:"odds_margin" db:"OddsMargin"`
	STOddsMargin2        string  `json:"st_odds_margin2" db:"ST_OddsMargin2"`
	OddsMargin2          float64 `json:"odds_margin2" db:"OddsMargin2"`
}
