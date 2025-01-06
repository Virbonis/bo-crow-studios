package model

type League struct {
	SportName       string `json:"sport_name" db:"Sport_Name"`
	LeagueID        int    `json:"league_id" db:"League_ID"`
	LeagueName      string `json:"league_name" db:"League_Name"`
	IsSelected      string `json:"is_selected" db:"Is_Selected"`
	NoDisplay       int    `json:"no_display" db:"No_Display"`
	NoDisplayLeague int    `json:"no_display_league" db:"No_Display_League"`
}

type InstantBetLeague struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}

type MasterLeague struct {
	ProfileID      string `json:"profile_id" db:"Profile_ID"`
	LeagueID       int    `json:"league_id" db:"League_ID"`
	LeagueSequence int    `json:"league_sequence" db:"League_Sequence"`
	LeagueNameEN   string `json:"league_name_en" db:"League_Name_EnUS"`
	LeagueNameCN   string `json:"league_name_cn" db:"League_Name_ZhCN"`
	LeagueNameTW   string `json:"league_name_tw" db:"League_Name_ZhTW"`
	LeagueNameTH   string `json:"league_name_th" db:"League_Name_ThTH"`
	LeagueNameJP   string `json:"league_name_jp" db:"League_Name_JaJP"`
	LeagueNameKR   string `json:"league_name_kr" db:"League_Name_KoKR"`
	LeagueNameVN   string `json:"league_name_vn" db:"League_Name_ViVN"`
	LeagueNameID   string `json:"league_name_id" db:"League_Name_IdID"`
	PriceGroup     int    `json:"price_group" db:"Price_Group"`
	Category       string `json:"category" db:"Category"`
	Active         string `json:"active" db:"Active"`
	NoDisplayLive  int    `json:"no_display_live" db:"No_Display_Live"`
	ShortName      string `json:"short_name" db:"Short_Name"`
	Profile1X2     string `json:"profile1x2" db:"Profile1X2"`
	IsProtected    bool   `json:"is_protected" db:"Is_Protected"`
	Competition    string `json:"competition" db:"Competition"`
	SportID        int    `json:"sport_id" db:"Sport_ID"`
	IndexNumber    int    `json:"index_number" db:"Index_Number"`
	AllowedDelete  int    `json:"allowed_delete" db:"Allowed_Delete"`
}

type MasterLeagueDetail struct {
	EvOddsStep             int     `json:"ev_odds_step" db:"EvOddsStep"`
	EvOddsStepOU           int     `json:"ev_odds_step_ou" db:"EvOddsStepOU"`
	EvOddsStepTimerHT      int     `json:"ev_odds_step_timer_ht" db:"EvOddsStepTimerHT"`
	EvOddsStepTimerFT      int     `json:"ev_odds_step_timer_ft" db:"EvOddsStepTimerFT"`
	OddsSpreadParlayAH     int     `json:"odds_spread_parlay_ah" db:"OddsSpreadParlayAH"`
	OddsSpreadParlayOU     int     `json:"odds_spread_parlay_ou" db:"OddsSpreadParlayOU"`
	OddsPointDiffAH        int     `json:"odds_point_diff_ah" db:"OddsPointDiffAH"`
	OddsPointDiffOU        int     `json:"odds_point_diff_ou" db:"OddsPointDiffOU"`
	OddsPointDiffAHLive    int     `json:"odds_point_diff_ah_live" db:"OddsPointDiffAHLive"`
	OddsPointDiffOULive    float32 `json:"odds_point_diff_ou_live" db:"OddsPointDiffOULive"`
	Odds1Diff              float32 `json:"odds_1_diff" db:"Odds1Diff"`
	Odds2Diff              float32 `json:"odds_2_diff" db:"Odds2Diff"`
	Odds3Diff              float32 `json:"odds_3_diff" db:"Odds3Diff"`
	Odds1DiffHT            float32 `json:"odds_1_diff_ht" db:"Odds1DiffHT"`
	Odds2DiffHT            float32 `json:"odds_2_diff_ht" db:"Odds2DiffHT"`
	Odds3DiffHT            float32 `json:"odds_3_diff_ht" db:"Odds3DiffHT"`
	TotalPauseEarly        float32 `json:"total_pause_early" db:"TotalPauseEarly"`
	TotalPauseToday        float32 `json:"total_pause_today" db:"TotalPauseToday"`
	ST_AutoClose           string  `json:"st_auto_close" db:"ST_AutoClose"`
	AutoCloseInterval      string  `json:"auto_close_interval" db:"AutoCloseInterval"`
	OddsSpreadParlayAHLive int     `json:"odds_spread_parlay_ah_live" db:"OddsSpreadParlayAHLive"`
	OddsSpreadParlayOULive int     `json:"odds_spread_parlay_ou_live" db:"OddsSpreadParlayOULive"`
	MaxBetTimerAH_FT       int     `json:"max_bet_timer_ah_ft" db:"MaxBetTimerAH_FT"`
	MaxBetPercentAH_FT     float64 `json:"max_bet_percent_ah_ft" db:"MaxBetPercentAH_FT"`
	MaxBetTimerOU_FT       int     `json:"max_bet_timer_ou_ft" db:"MaxBetTimerOU_FT"`
	MaxBetPercentOU_FT     float64 `json:"max_bet_percent_ou_ft" db:"MaxBetPercentOU_FT"`
	MaxBetTimerAH_HT       int     `json:"max_bet_timer_ah_ht" db:"MaxBetTimerAH_HT"`
	MaxBetPercentAH_HT     float64 `json:"max_bet_percent_ah_ht" db:"MaxBetPercentAH_HT"`
	MaxBetTimerOU_HT       int     `json:"max_bet_timer_ou_ht" db:"MaxBetTimerOU_HT"`
	MaxBetPercentOU_HT     float64 `json:"max_bet_percent_ou_ht" db:"MaxBetPercentOU_HT"`
	LimitID                string  `json:"limit_id" db:"LimitID"`
	LimitID1x2             string  `json:"limit_id1x2" db:"LimitID1x2"`
	TotalPauseLive         float64 `json:"total_pause_live" db:"TotalPauseLive"`
	LAP1X2_HT              float64 `json:"lap1x2_ht" db:"LAP1X2_HT"`
	LAP1X2_FT              float64 `json:"lap1x2_ft" db:"LAP1X2_FT"`
	LAPLive1X2_HT          float64 `json:"lap_live1x2_ht" db:"LAPLive1X2_HT"`
	LAPLive1X2_FT          float64 `json:"lap_live1x2_ft" db:"LAPLive1X2_FT"`
	ST_BookingBG           string  `json:"st_booking_bg" db:"ST_BookingBG"`
	MaxBetTimerAH_FT_2     int     `json:"max_bet_timer_ah_ft_2" db:"MaxBetTimerAH_FT_2"`
	MaxBetPercentAH_FT_2   float64 `json:"max_bet_percent_ah_ft_2" db:"MaxBetPercentAH_FT_2"`
	MaxBetTimerOU_FT_2     int     `json:"max_bet_timer_ou_ft_2" db:"MaxBetTimerOU_FT_2"`
	MaxBetPercentOU_FT_2   float64 `json:"max_bet_percent_ou_ft_2" db:"MaxBetPercentOU_FT_2"`
	MaxBetTimerAH_HT_2     int     `json:"max_bet_timer_ah_ht_2" db:"MaxBetTimerAH_HT_2"`
	MaxBetPercentAH_HT_2   float64 `json:"max_bet_percent_ah_ht_2" db:"MaxBetPercentAH_HT_2"`
	MaxBetTimerOU_HT_2     int     `json:"max_bet_timer_ou_ht_2" db:"MaxBetTimerOU_HT_2"`
	MaxBetPercentOU_HT_2   float64 `json:"max_bet_percent_ou_ht_2" db:"MaxBetPercentOU_HT_2"`
	MaxLimitPercentAH_FT   float64 `json:"max_limit_percent_ah_ft" db:"MaxLimitPercentAH_FT"`
	MaxLimitPercentOU_FT   float64 `json:"max_limit_percent_ou_ft" db:"MaxLimitPercentOU_FT"`
	MaxLimitPercentAH_HT   float64 `json:"max_limit_percent_ah_ht" db:"MaxLimitPercentAH_HT"`
	MaxLimitPercentOU_HT   float64 `json:"max_limit_percent_ou_ht" db:"MaxLimitPercentOU_HT"`
	MaxLimitPercentAH_FT_2 float64 `json:"max_limit_percent_ah_ft_2" db:"MaxLimitPercentAH_FT_2"`
	MaxLimitPercentOU_FT_2 float64 `json:"max_limit_percent_ou_ft_2" db:"MaxLimitPercentOU_FT_2"`
	MaxLimitPercentAH_HT_2 float64 `json:"max_limit_percent_ah_ht_2" db:"MaxLimitPercentAH_HT_2"`
	MaxLimitPercentOU_HT_2 float64 `json:"max_limit_percent_ou_ht_2" db:"MaxLimitPercentOU_HT_2"`
	ParentLeagueID         int     `json:"parent_league_id" db:"ParentLeagueID"`
	SpecialCode            string  `json:"special_code" db:"SpecialCode"`
	LeagueGroup            string  `json:"league_group" db:"LeagueGroup"`
	RegionID               int     `json:"region_id" db:"RegionID"`

	LinkOddsDiff_AH        int  `json:"link_odds_diff_ah" db:"LinkOddsDiff_AH"`
	LinkOddsSpread_AH      int  `json:"link_odds_spread_ah" db:"LinkOddsSpread_AH"`
	LinkOddsDiffLock_AH    bool `json:"link_odds_diff_lock_ah" db:"LinkOddsDiffLock_AH"`
	LinkOddsDiff_AH_HT     int  `json:"link_odds_diff_ah_ht" db:"LinkOddsDiff_AH_HT"`
	LinkOddsSpread_AH_HT   int  `json:"link_odds_spread_ah_ht" db:"LinkOddsSpread_AH_HT"`
	LinkOddsDiffLock_AH_HT bool `json:"link_odds_diff_lock_ah_ht" db:"LinkOddsDiffLock_AH_HT"`
	LinkOddsDiff_OU        int  `json:"link_odds_diff_ou" db:"LinkOddsDiff_OU"`
	LinkOddsSpread_OU      int  `json:"link_odds_spread_ou" db:"LinkOddsSpread_OU"`
	LinkOddsDiffLock_OU    bool `json:"link_odds_diff_lock_ou" db:"LinkOddsDiffLock_OU"`
	LinkOddsDiff_OU_HT     int  `json:"link_odds_diff_ou_ht" db:"LinkOddsDiff_OU_HT"`
	LinkOddsSpread_OU_HT   int  `json:"link_odds_spread_ou_ht" db:"LinkOddsSpread_OU_HT"`
	LinkOddsDiffLock_OU_HT bool `json:"link_odds_diff_lock_ou_ht" db:"LinkOddsDiffLock_OU_HT"`
}

type MasterLeagueExport struct {
	SportName    string `json:"sport_name" db:"Sport_Name"`
	LeagueID     string `json:"league_id" db:"League_ID"`
	LeagueNameEN string `json:"league_name_en" db:"League_Name_EnUS"`
	ProfileID    string `json:"profile_id" db:"Profile_ID"`
	Profile1X2   string `json:"profile1x2" db:"Profile1X2"`
	PriceGroup   string `json:"price_group" db:"Price_Group"`
	Category     string `json:"category" db:"Category"`
	Active       string `json:"active" db:"Active"`
}

type LeagueSelect struct {
	LeagueId       int    `json:"league_id" db:"LeagueID"`
	LeagueName     string `json:"league_name" db:"LeagueName"`
	LeagueCategory string `json:"league_category" db:"LeagueCategory"`
}

type LeagueSelectMatchList struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}

type LeagueSelectMappingLottery struct {
	NoEvents   int    `json:"league_id" db:"No_Events"`
	NamaEvents string `json:"league_name" db:"Nama_Events"`
}

type LeagueSelectAddOutright struct {
	NoEvents   int    `json:"league_id" db:"No_Events"`
	NamaEvents string `json:"league_name" db:"Nama_Events"`
	Category   string `json:"category" db:"Category"`
}

type LeagueAddMatch struct {
	LeagueID    int    `json:"league_id" db:"No_Events"`
	LeagueName  string `json:"league_name" db:"Nama_Events"`
	Category    string `json:"category" db:"Category"`
	SpecialCode string `json:"special_code" db:"SpecialCode"`
}

type LeagueMappingLeague struct {
	No_Events   int    `json:"no_events" db:"No_Events"`
	Nama_Events string `json:"nama_events" db:"Nama_Events"`
	Our_League  string `json:"our_league" db:"Our_League"`
}

type LeagueMappingLeagueRBall struct {
	NoEvents   int    `json:"no_events" db:"No_Events"`
	NamaEvents string `json:"nama_events" db:"Nama_Events"`
	OurLeague  string `json:"our_league" db:"Our_League"`
}

type LeagueSelectMappingBuilder struct {
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}

type LeagueOnlineList struct {
	SportName  string `json:"sport_name" db:"Sport_Name"`
	LeagueID   int    `json:"league_id" db:"League_ID"`
	LeagueName string `json:"league_name" db:"League_Name"`
}
