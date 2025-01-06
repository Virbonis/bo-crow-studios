package model

type ListTradingDeadballSpecial struct {
	SportID             int     `json:"sport_id" db:"Sport_ID"`
	SportSequence       int     `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueID            int     `json:"league_id" db:"League_ID"`
	LeagueName          string  `json:"league_name" db:"League_Name"`
	LeagueSequence      int     `json:"league_sequence" db:"League_Sequence"`
	ProfileID           string  `json:"profile_id" db:"Profile_ID"`
	MatchID             int     `json:"match_id" db:"Match_ID"`
	MatchDate           string  `json:"match_date" db:"Match_Date"`
	MatchPauseStatus    int     `json:"match_pause_status" db:"Match_Pause_Status"`
	MatchOpenStatus     string  `json:"match_open_status" db:"Match_Open_Status"`
	MatchSequence       string  `json:"match_sequence" db:"Match_Sequence"`
	HomeName            string  `json:"home_name" db:"Home_Name"`
	AwayName            string  `json:"away_name" db:"Away_Name"`
	SubMatchID          int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchOpenStatus  string  `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchPauseStatus int     `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchOddsStep    int     `json:"sub_match_odds_step" db:"Sub_Match_Odds_Step"`
	GameType            int     `json:"game_type" db:"GameType"`
	Type                int     `json:"type" db:"Type"`
	Odds1               float64 `json:"odds1" db:"Odds1"`
	Odds2               float64 `json:"odds2" db:"Odds2"`
	Odds3               float64 `json:"odds3" db:"Odds3"`
	Odds4               float64 `json:"odds4" db:"Odds4"`
	Odds5               float64 `json:"odds5" db:"Odds5"`
	Odds6               float64 `json:"odds6" db:"Odds6"`
	Odds7               float64 `json:"odds7" db:"Odds7"`
	Odds8               float64 `json:"odds8" db:"Odds8"`
	Odds9               float64 `json:"odds9" db:"Odds9"`
	Odds10              float64 `json:"odds10" db:"Odds10"`
	Jml1                float64 `json:"jml1" db:"Jml1"`
	Jml2                float64 `json:"jml2" db:"Jml2"`
	Jml3                float64 `json:"jml3" db:"Jml3"`
	Jml4                float64 `json:"jml4" db:"Jml4"`
	Jml5                float64 `json:"jml5" db:"Jml5"`
	Jml6                float64 `json:"jml6" db:"Jml6"`
	Jml7                float64 `json:"jml7" db:"Jml7"`
	Jml8                float64 `json:"jml8" db:"Jml8"`
	Jml9                float64 `json:"jml9" db:"Jml9"`
	Jml10               float64 `json:"jml10" db:"Jml10"`
	T1                  float64 `json:"t1" db:"T1"`
	T2                  float64 `json:"t2" db:"T2"`
	T3                  float64 `json:"t3" db:"T3"`
	T4                  float64 `json:"t4" db:"T4"`
	T5                  float64 `json:"t5" db:"T5"`
	T6                  float64 `json:"t6" db:"T6"`
	T7                  float64 `json:"t7" db:"T7"`
	T8                  float64 `json:"t8" db:"T8"`
	T9                  float64 `json:"t9" db:"T9"`
	T10                 float64 `json:"t10" db:"T10"`
	PriceAlert          int     `json:"price_alert" db:"Price_Alert"`
	PriceAlertTrader    int     `json:"price_alert_trader" db:"Price_Alert_Trader"`
	TraderGroup         string  `json:"trader_group" db:"TraderGroup"`
	TraderGroupPause    string  `json:"trader_group_pause" db:"TraderGroupPause"`
	LastChange          string  `json:"last_change" db:"LastChange"`
	ReasonPause         string  `json:"reason_pause" db:"Reason_Pause"`
	AutoPause           int     `json:"auto_pause" db:"Auto_Pause"`
	IsProfileChanged    int     `json:"is_profile_changed" db:"Is_Profile_Changed"`
	LastUpdateSecond    int     `json:"last_update_second" db:"LastUpdateSecond"`
	SortIndex           string  `json:"sort_index" db:"SortIndex"`
	Handicap            int     `json:"handicap" db:"Handicap"`
}
