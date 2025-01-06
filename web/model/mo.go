package model

import (
	"time"

	"github.com/guregu/null"
	"github.com/shopspring/decimal"
)

type MO struct {
	SportID              int    `json:"sport_id" db:"Sport_ID"`
	SportSequence        int    `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueSequence       int    `json:"league_sequence" db:"League_Sequence"`
	MatchID              int    `json:"match_id" db:"Match_ID"`
	MatchLiveStatus      string `json:"match_live_status" db:"Match_Live_Status"`
	MatchPauseStatus     int    `json:"match_pause_status" db:"Match_Pause_Status"`
	MatchOpenStatus      string `json:"match_open_status" db:"Match_Open_Status"`
	MatchSequence        int    `json:"match_sequence" db:"Match_Sequence"`
	MatchSpecialSequence string `json:"match_special_sequence" db:"Match_Special_Sequence"`
	MatchRound           int    `json:"match_round" db:"Match_Round"`
	MatchElapsed         int    `json:"match_elapsed" db:"Match_Elapsed"`
	MatchAutoOdds        string `json:"match_auto_odds" db:"Match_Auto_Odds"`

	HomeName    string `json:"home_name" db:"Home_Name"`
	AwayName    string `json:"away_name" db:"Away_Name"`
	HomePosisi  int    `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi  int    `json:"away_posisi" db:"Away_Posisi"`
	HomeRC      int    `json:"home_rc" db:"Home_RC"`
	AwayRC      int    `json:"away_rc" db:"Away_RC"`
	HTProcess   string `json:"ht_process" db:"HT_Process"`
	FTProcess   string `json:"ft_process" db:"FT_Process"`
	FGLGProcess string `json:"fglg_process" db:"FGLG_Process"`

	HTHomeScore int `json:"ht_home_score" db:"HT_Home_Score"`
	HTAwayScore int `json:"ht_away_score" db:"HT_Away_Score"`
	FSHomeScore int `json:"fs_home_score" db:"FS_Home_Score"`
	FSAwayScore int `json:"fs_away_score" db:"FS_Away_Score"`

	FGLGFirstGoal int `json:"fglg_first_goal" db:"FGLG_First_Goal"`
	FGLGLastGoal  int `json:"fglg_last_goal" db:"FGLG_Last_Goal"`
	FGLGCount     int `json:"fglg_count" db:"FGLG_Count"`

	EvOddsStepAH int `json:"ev_odds_step_ah" db:"EvOddsStepAH"`
	EvOddsStepOU int `json:"ev_odds_step_ou" db:"EvOddsStepOU"`

	STInjuryHT string `json:"st_injury_ht" db:"ST_InjuryHT"`
	STInjuryFT string `json:"st_injury_ft" db:"ST_InjuryFT"`
	InjuryHT   int    `json:"injury_ht" db:"InjuryHT"`
	InjuryFT   int    `json:"injury_ft" db:"InjuryFT"`
	STPenalty  string `json:"st_penalty" db:"ST_Penalty"`

	SubMatchID          int    `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchOpenStatus  string `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchPauseStatus int    `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchFavStatus   int    `json:"sub_match_fav_status" db:"Sub_Match_Fav_Status"`

	Type               int        `json:"type" db:"Type"`
	DisplayAdmin       int        `json:"display_admin" db:"Display_Admin"`
	GameType           int        `json:"game_type" db:"GameType"`
	Handicap           float64    `json:"handicap" db:"Handicap"`
	OddsHome           float32    `json:"odds_home" db:"OddsHome"`
	OddsAway           float32    `json:"odds_away" db:"OddsAway"`
	OddsDraw           float32    `json:"odds_draw" db:"OddsDraw"`
	Spread1x2          int        `json:"spread_1x2" db:"Spread1X2"`
	OddsHomeSBO        float64    `json:"odds_home_sbo" db:"OddsHomeSBO"`
	OddsAwaySBO        float64    `json:"odds_away_sbo" db:"OddsAwaySBO"`
	LDiff              float64    `json:"ldiff" db:"LDiff"`
	JmlHome            float64    `json:"jml_home" db:"JmlHome"`
	JmlAway            float64    `json:"jml_away" db:"JmlAway"`
	JmlDraw            float64    `json:"jml_draw" db:"JmlDraw"`
	THome              float64    `json:"t_home" db:"THome"`
	TAway              float64    `json:"t_away" db:"TAway"`
	TDraw              float64    `json:"t_draw" db:"TDraw"`
	SpreadPerc         null.Float `json:"spread_perc" db:"SpreadPerc"`
	AutoCalcOddsStatus string     `json:"auto_call_odds_status" db:"AutoCalcOdds_Status"`

	PriceAlert       int    `json:"price_alert" db:"Price_Alert"`
	PriceAlertTrader int    `json:"price_alert_trader" db:"Price_Alert_Trader"`
	TraderGroup      string `json:"trader_group" db:"TraderGroup"`
	TraderGroupPause string `json:"trader_group_pause" db:"TraderGroupPause"`
	LastChange       string `json:"last_change" db:"LastChange"`
	ReasonPause      string `json:"reason_pause" db:"Reason_Pause"`

	LastChangeHandicap int `json:"last_change_handicap" db:"LastChangeHandicap"`
	LastChangeSpread   int `json:"last_change_spread" db:"LastChangeSpread"`
	LastChangeLDiff    int `json:"last_change_ldiff" db:"LastChangeLDiff"`
	LastUpdateOdds     int `json:"last_update_odds" db:"LastUpdateOdds"`
	LastUpdateHA       int `json:"last_update_ha" db:"LastUpdateHA"`

	TraderGroupHdcDisplay         string `json:"trader_group_hdc_display" db:"TraderGroupHdcDisplay"`
	TraderGroupLeechingSpreadOdds string `json:"trader_group_leeching_spread_odds" db:"TraderGroupLeechingSpreadOdds"`
	TraderGroupOddsStepMapping    string `json:"trader_group_odds_step_mapping" db:"TraderGroupOddsStepMapping"`
	TraderGroupHA                 string `json:"trader_group_ha" db:"TraderGroupHA"`

	AlertTraderHandicap int `json:"alert_trader_handicap" db:"Alert_Trader_Handicap"`
	AlertTraderSpread   int `json:"alert_trader_spread" db:"Alert_Trader_Spread"`
	AlertTraderLDiff    int `json:"alert_trader_ldiff" db:"Alert_Trader_LDiff"`
	AlertTraderOdds     int `json:"alert_trader_odds" db:"Alert_Trader_Odds"`
	AlertTraderHA       int `json:"alert_trader_ha" db:"Alert_Trader_HA"`

	LastUpdateOddsHome  int    `json:"last_update_odds_home" db:"LastUpdateOddsHome"`
	LastUpdateOddsDraw  int    `json:"last_update_odds_draw" db:"LastUpdateOddsDraw"`
	LastUpdateOddsAway  int    `json:"last_update_odds_away" db:"LastUpdateOddsAway"`
	AlertTraderOddsHome int    `json:"alert_trader_odds_home" db:"Alert_Trader_OddsHome"`
	AlertTraderOddsDraw int    `json:"alert_trader_odds_draw" db:"Alert_Trader_OddsDraw"`
	AlertTraderOddsAway int    `json:"alert_trader_odds_away" db:"Alert_Trader_OddsAway"`
	AlertStock1x2       int    `json:"alert_stock_1x2" db:"Alert_Stock_1X2"`
	Profile1x2          string `json:"profile_1x2" db:"Profile_1X2"`

	AutoOdds     int    `json:"auto_odds" db:"Auto_Odds"`
	LockShift    int    `json:"lock_shift" db:"Lock_Shift"`
	AutoPause    int    `json:"auto_pause" db:"Auto_Pause"`
	ShowAutoOdds string `json:"show_auto_odds" db:"Show_Auto_Odds"`

	OddsName       null.String `json:"odds_name" db:"OddsName"`
	SortIndex      string      `json:"sort_index" db:"SortIndex"`
	STFollowRBall  int         `json:"st_follow_rball" db:"ST_FollowRball"`
	NeutralGround  string      `json:"neutral_ground" db:"Neutral_Ground"`
	ST4PointDiff   string      `json:"st_4point_diff" db:"ST_4PointDiff"`
	EvUpdateOdds   int         `json:"ev_update_odds" db:"EvUpdateOdds"`
	EvTimer        time.Time   `json:"ev_timer" db:"EvTimer"`
	EvCompareTimer time.Time   `json:"ev_compare_timer" db:"EvCompareTimer"`
	STStopTimer    string      `json:"st_stop_timer" db:"ST_StopTimer"`
	HomeYC         int         `json:"home_yc" db:"Home_YC"`
	AwayYC         int         `json:"away_yc" db:"Away_YC"`

	LeagueID             int       `json:"league_id" db:"LeagueID"`
	HomeID               int       `json:"home_id" db:"HomeID"`
	AwayID               int       `json:"away_id" db:"AwayID"`
	MatchDate            time.Time `json:"match_date" db:"MatchDate"`
	LeagueSequenceParent int       `json:"league_sequence_parent" db:"League_Sequence_Parent"`
	IsEnableBG1x2        string    `json:"is_enable_bg_1x2" db:"isEnableBG_1x2"`
	StatusBG1x2          string    `json:"status_bg_1x2" db:"statusBG_1x2"`
	EarlySettlementAlert int       `json:"early_settlement_alert" db:"EarlySettlementAlert"`
	LinkOddsDiff         int       `json:"link_odds_diff" db:"Link_Odds_Diff"`
	LimitID              string    `json:"limit_id" db:"LimitID"`
}
type MOCS struct {
	SportID              int       `json:"sport_id" db:"Sport_ID"`
	LeagueID             int       `json:"league_id" db:"League_ID"`
	SportSequence        int       `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueSequence       int       `json:"league_sequence" db:"League_Sequence"`
	MatchID              int       `json:"match_id" db:"Match_ID"`
	MatchDate            time.Time `json:"match_date" db:"Match_Date"`
	HomeID               int       `json:"home_id" db:"Home_ID"`
	AwayID               int       `json:"away_id" db:"Away_ID"`
	HomeName             string    `json:"home_name" db:"Home_Name"`
	AwayName             string    `json:"away_name" db:"Away_Name"`
	HomePosisi           int       `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi           int       `json:"away_posisi" db:"Away_Posisi"`
	GameType             int       `json:"game_type" db:"GameType"`
	HomeScore            int       `json:"home_score" db:"HomeScore"`
	AwayScore            int       `json:"away_score" db:"AwayScore"`
	Score                string    `json:"score" db:"Score"`
	Odds                 float64   `json:"odds" db:"Odds"`
	SubMatchOpenStatus   string    `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchPauseStatus  int       `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	ChoiceCode           string    `json:"choice_code" db:"ChoiceCode"`
	Total                int       `json:"total" db:"Total"`
	TotalBet             float64   `json:"total_bet" db:"TotalBet"`
	LeagueSequenceParent int       `json:"league_sequence_parent" db:"League_Sequence_Parent"`
	HomeRC               int       `json:"home_rc" db:"Home_RC"`
	AwayRC               int       `json:"away_rc" db:"Away_RC"`
	STPenalty            string    `json:"st_penalty" db:"ST_Penalty"`
	LimitID              string    `json:"limit_id" db:"LimitID"`
}

type MOEditAHOU struct {
	AutoAcceptDelayAway   int         `json:"auto_accept_delay_away" db:"Auto_Accept_Delay_Away"`
	AutoAcceptDelayHome   int         `json:"auto_accept_delay_home" db:"Auto_Accept_Delay_Home"`
	AutoAcceptDelayOver   int         `json:"auto_accept_delay_over" db:"Auto_Accept_Delay_Over"`
	AutoAcceptDelayUnder  int         `json:"auto_accept_delay_under" db:"Auto_Accept_Delay_Under"`
	AutoCloseInterval     string      `json:"auto_close_interval" db:"Auto_Close_Interval"`
	AutoCloseStatus       string      `json:"auto_close_status" db:"Auto_Close_Status"`
	AutoOdds              int         `json:"auto_odds" db:"Auto_Odds"`
	AwayID                int         `json:"away_id" db:"Away_Club"`
	AwayName              string      `json:"away_name" db:"Away_Name"`
	AwayPosisi            int         `json:"away_posisi" db:"Away_Posisi"`
	AwayRc                int         `json:"away_rc" db:"Away_RC"`
	BbStatus              string      `json:"bb_status" db:"BB_Status"`
	BgStatus              string      `json:"bg_status" db:"BGStatus"`
	Category              string      `json:"category" db:"Category"`
	HomeID                int         `json:"home_id" db:"Home_Club"`
	HomeName              string      `json:"home_name" db:"Home_Name"`
	HomePosisi            int         `json:"home_posisi" db:"Home_Posisi"`
	HomeRc                int         `json:"home_rc" db:"Home_RC"`
	IsAddNoC              string      `json:"is_add_no_c" db:"Is_AddNoC"`
	IsAllowedCsLiveBg     int         `json:"is_allowed_cs_live_bg" db:"isAllowedCSLiveBG"`
	IsAllowedHtcsLiveBg   int         `json:"is_allowed_htcs_live_bg" db:"isAllowedHTCSLiveBG"`
	IsAutoProcessBetBazar null.String `json:"is_autoprocess_betbazar" db:"isAutoProcess_BetBazar"`
	IsAutoProcessIM       null.String `json:"is_autoprocess_im" db:"isAutoProcess_IM"`
	IsCsLiveBg            int         `json:"is_cs_live_bg" db:"isCSLiveBG"`
	IsEnableBb            string      `json:"is_enable_bb" db:"isEnableBB"`
	IsEnableOebg          int         `json:"is_enable_oe_bg" db:"isEnableOEBG"`
	IsFollow              string      `json:"is_follow" db:"IsFollow"`
	IsHtcsLiveBg          int         `json:"is_htcs_live_bg" db:"isHTCSLiveBG"`
	IsRBallExist          int         `json:"is_r_ball_exist" db:"Is_RBall_Exist"`
	IsShowAutoAddMatch    string      `json:"is_show_auto_add_match" db:"isShowAutoAddMatch"`
	LeagueCategory        string      `json:"league_category" db:"LeagueCategory"`
	LeagueId              int         `json:"league_id" db:"League_ID"`
	LeagueName            string      `json:"league_name" db:"League_Name"`
	LimitId               string      `json:"limit_id" db:"LimitID"`
	MatchDate             string      `json:"match_date" db:"Match_Date"`
	MatchHasLiveStatus    string      `json:"match_has_live_status" db:"Match_Has_Live_Status"`
	MatchHiddenTimeStatus int         `json:"match_hidden_time_status" db:"Match_Hidden_Time_Status"`
	MatchId               int         `json:"match_id" db:"Match_ID"`
	MatchLiveStatus       string      `json:"match_live_status" db:"Match_Live_Status"`
	MatchNeutralStatus    string      `json:"match_neutral_status" db:"Match_Neutral_Status"`
	MatchOpenStatus       string      `json:"match_open_status" db:"Match_Open_Status"`
	OebgStatus            int         `json:"oebg_status" db:"OEBG_Status"`
	ProviderName          string      `json:"provider_name" db:"ProviderName"`
	RBallStatus           int         `json:"r_ball_status" db:"RBallStatus"`
	RbStatus              string      `json:"rb_status" db:"RBStatus"`
	SpecialCode           string      `json:"special_code" db:"SpecialCode"`
	SportId               int         `json:"sport_id" db:"Sport_ID"`
	SportName             string      `json:"sport_name" db:"Sport_Name"`
	StEtpen               string      `json:"st_etpen" db:"ST_ETPEN"`
	StSportsTicker        string      `json:"st_sports_ticker" db:"ST_SportsTicker"`
	Trader                string      `json:"trader" db:"Trader"`
	Weather               int         `json:"weather" db:"Weather"`
}
type MOEditAHOU2 struct {
	CAPLong                decimal.Decimal `json:"cap_long" db:"CAP_Long"`
	CAPShort               decimal.Decimal `json:"cap_short" db:"CAP_Short"`
	GameType               int             `json:"game_type" db:"GameType"`
	LAPLong                decimal.Decimal `json:"lap_long" db:"LAP_Long"`
	LAPShort               decimal.Decimal `json:"lap_short" db:"LAP_Short"`
	LinkOddsDiff           int             `json:"link_odds_diff" db:"Link_Odds_Diff"`
	LinkOddsDiffLock       int             `json:"link_odds_diff_lock" db:"Link_Odds_Diff_Lock"`
	LinkSpreadDiff         decimal.Decimal `json:"link_spread_diff" db:"Link_Spread_Diff"`
	MaxBet1                decimal.Decimal `json:"max_bet_1" db:"Max_Bet_1"`
	MaxBet2                decimal.Decimal `json:"max_bet_2" db:"Max_Bet_2"`
	MaxBet3                decimal.Decimal `json:"max_bet_3" db:"Max_Bet_3"`
	MaxBet4                decimal.Decimal `json:"max_bet_4" db:"Max_Bet_4"`
	MaxLimit1              decimal.Decimal `json:"max_limit_1" db:"Max_Limit_1"`
	MaxLimit2              decimal.Decimal `json:"max_limit_2" db:"Max_Limit_2"`
	MaxLimit3              decimal.Decimal `json:"max_limit_3" db:"Max_Limit_3"`
	MaxLimit4              decimal.Decimal `json:"max_limit_4" db:"Max_Limit_4"`
	OddsPointDiff          decimal.Decimal `json:"odds_point_diff" db:"Odds_Point_Diff"`
	OddsPointDiffLive      decimal.Decimal `json:"odds_point_diff_live" db:"Odds_Point_Diff_Live"`
	OddsSpreadParlay       decimal.Decimal `json:"odds_spread_parlay" db:"Odds_Spread_Parlay"`
	OddsSpreadParlayLive   decimal.Decimal `json:"odds_spread_parlay_live" db:"Odds_Spread_Parlay_Live"`
	OddsTrigger1           decimal.Decimal `json:"odds_trigger_1" db:"Odds_Trigger_1"`
	OddsTrigger2           decimal.Decimal `json:"odds_trigger_2" db:"Odds_Trigger_2"`
	OddsTrigger3           decimal.Decimal `json:"odds_trigger_3" db:"Odds_Trigger_3"`
	OddsTrigger4           decimal.Decimal `json:"odds_trigger_4" db:"Odds_Trigger_4"`
	Spread                 decimal.Decimal `json:"spread" db:"Spread"`
	SpreadSBO              decimal.Decimal `json:"spread_sbo" db:"Spread_SBO"`
	Step1                  int             `json:"step_1" db:"Step_1"`
	Step2                  int             `json:"step_2" db:"Step_2"`
	Step3                  int             `json:"step_3" db:"Step_3"`
	Step4                  int             `json:"step_4" db:"Step_4"`
	STParlay               int             `json:"st_parlay" db:"ST_Parlay"`
	SubMatchID             int             `json:"sub_match_id" db:"Sub_Match_ID"`
	TimedMaxBetDiff        decimal.Decimal `json:"timed_maxbet_diff" db:"Timed_MaxBet_Diff"`
	TimedMaxBetDiff2       decimal.Decimal `json:"timed_maxbet_diff_2" db:"Timed_MaxBet_Diff_2"`
	TimedMaxBetDiffMinute  decimal.Decimal `json:"timed_maxbet_diff_minute" db:"Timed_MaxBet_Diff_Minute"`
	TimedMaxBetDiffMinute2 decimal.Decimal `json:"timed_maxbet_diff_minute_2" db:"Timed_MaxBet_Diff_Minute_2"`
	TimedMaxLimitDiff      decimal.Decimal `json:"timed_maxlimit_diff" db:"Timed_MaxLimit_Diff"`
	TimedMaxLimitDiff2     decimal.Decimal `json:"timed_maxlimit_diff_2" db:"Timed_MaxLimit_Diff_2"`
	TotalTicket            decimal.Decimal `json:"total_ticket" db:"Total_Ticket"`
}
type MOEditAHOU3 struct {
	GameType      int             `json:"game_type" db:"GameType"`
	LAP           decimal.Decimal `json:"lap" db:"LAP"`
	LAPLive       decimal.Decimal `json:"laplive" db:"LAPLive"`
	MaxPayout     decimal.Decimal `json:"maxpayout" db:"MaxPayout"`
	MaxPayout1    decimal.Decimal `json:"maxpayout1" db:"MaxPayout1"`
	MaxPayout2    decimal.Decimal `json:"maxpayout2" db:"MaxPayout2"`
	MaxPayout3    decimal.Decimal `json:"maxpayout3" db:"MaxPayout3"`
	MaxPayoutLive decimal.Decimal `json:"maxpayoutlive" db:"MaxPayoutLive"`
	Odds1         decimal.Decimal `json:"odds1" db:"Odds1"`
	Odds2         decimal.Decimal `json:"odds2" db:"Odds2"`
	Odds3         decimal.Decimal `json:"odds3" db:"Odds3"`
	OddsDiff1     decimal.Decimal `json:"oddsdiff1" db:"OddsDiff1"`
	OddsDiff2     decimal.Decimal `json:"oddsdiff2" db:"OddsDiff2"`
	OddsDiff3     decimal.Decimal `json:"oddsdiff3" db:"OddsDiff3"`
	STParlay      int             `json:"st_parlay" db:"ST_Parlay"`
	SubMatchID    int             `json:"sub_match_id" db:"Sub_Match_ID"`
}
type MOScoringDetail struct {
	MatchID      int         `json:"match_id" db:"MatchID"`
	SportID      int         `json:"sport_id" db:"SportID"`
	SportName    string      `json:"sport_name" db:"SportName"`
	RowID        null.Int    `json:"row_id" db:"RowID"`
	CurrentSet   null.Int    `json:"current_set" db:"CurrentSet"`
	StGeneral    null.String `json:"st_general" db:"ST_General"`
	StLiveScore  null.String `json:"st_livescore" db:"ST_LiveScore"`
	BallPosition null.Int    `json:"ball_position" db:"BallPosition"`
	Home1        null.Int    `json:"home1" db:"Home1"`
	Away1        null.Int    `json:"away1" db:"Away1"`
	Home2        null.Int    `json:"home2" db:"Home2"`
	Away2        null.Int    `json:"away2" db:"Away2"`
	Home3        null.Int    `json:"home3" db:"Home3"`
	Away3        null.Int    `json:"away3" db:"Away3"`
	Home4        null.Int    `json:"home4" db:"Home4"`
	Away4        null.Int    `json:"away4" db:"Away4"`
	Home5        null.Int    `json:"home5" db:"Home5"`
	Away5        null.Int    `json:"away5" db:"Away5"`
	Home6        null.Int    `json:"home6" db:"Home6"`
	Away6        null.Int    `json:"away6" db:"Away6"`
	Home7        null.Int    `json:"home7" db:"Home7"`
	Away7        null.Int    `json:"away7" db:"Away7"`
	Home8        null.Int    `json:"home8" db:"Home8"`
	Away8        null.Int    `json:"away8" db:"Away8"`
	Home9        null.Int    `json:"home9" db:"Home9"`
	Away9        null.Int    `json:"away9" db:"Away9"`
	Home10       null.Int    `json:"home10" db:"Home10"`
	Away10       null.Int    `json:"away10" db:"Away10"`
	Home11       null.Int    `json:"home11" db:"Home11"`
	Away11       null.Int    `json:"away11" db:"Away11"`
	Home12       null.Int    `json:"home12" db:"Home12"`
	Away12       null.Int    `json:"away12" db:"Away12"`
	Home13       null.Int    `json:"home13" db:"Home13"`
	Away13       null.Int    `json:"away13" db:"Away13"`
	Home14       null.Int    `json:"home14" db:"Home14"`
	Away14       null.Int    `json:"away14" db:"Away14"`
	Home15       null.Int    `json:"home15" db:"Home15"`
	Away15       null.Int    `json:"away15" db:"Away15"`
	Home99       null.String `json:"home99" db:"Home99"`
	Away99       null.String `json:"away99" db:"Away99"`
	StInjured    null.String `json:"st_injured" db:"ST_Injured"`
	StWeather    null.String `json:"st_weather" db:"ST_Weather"`
}
type MOEarlySettlement struct {
	HomePosisi        int    `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi        int    `json:"away_posisi" db:"Away_Posisi"`
	StProcessType     int    `json:"st_process_type" db:"ST_ProcessType"`
	TotalTicket       int    `json:"total_ticket" db:"TotalTicket"`
	StSettle          int    `json:"st_settle" db:"ST_Settle"`
	EarlySettlementId string `json:"early_settlement_id" db:"EarlySettlementID"`
}

type MOEarlySettlementBetList struct {
	UserName          string `json:"username" db:"UserName"`
	TicketNo          string `json:"bet_id" db:"Ticket_No"`
	TicketDate        string `json:"bet_date" db:"Ticket_Date"`
	GameType          int    `json:"game_type" db:"GameType"`
	BetLiveStatus     string `json:"bet_live_status" db:"Bet_Live_Status"`
	MatchId           string `json:"match_id" db:"Match_ID"`
	LeagueName        string `json:"league_name" db:"League_Name"`
	SportName         string `json:"sport_name" db:"Sport_Name"`
	HomeName          string `json:"home_name" db:"Home_Name"`
	AwayName          string `json:"away_name" db:"Away_Name"`
	BetScoreHome      string `json:"bet_score_home" db:"Bet_Score_Home"`
	BetScoreAway      string `json:"bet_score_away" db:"Bet_Score_Away"`
	BetChoice         string `json:"bet_choice" db:"Bet_Choice"`
	Handicap          string `json:"handicap" db:"Handicap"`
	Odds              string `json:"odds" db:"Odds"`
	OddsType          string `json:"odds_type" db:"OddsType"`
	Currency          string `json:"currency" db:"Currency"`
	BetAmount         string `json:"bet_amount" db:"Bet_Amount"`
	BetAmountRmb      string `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	WinLossAmount     string `json:"winloss_amount" db:"WinLoss_Amount"`
	WinLossAmountRmb  string `json:"winloss_amount_rmb" db:"WinLoss_Amount_RMB"`
	WlStatus          string `json:"winloss_status" db:"WL_Status"`
	EarlySettlementId string `json:"early_settlement_id" db:"EarlySettlementID"`
}

type SpecialCode struct {
	SpecialCode string `json:"special_code" db:"Special_Code"`
	SpecialName string `json:"special_name" db:"Special_Name"`
}

type MOMoreOE struct {
	GameType                int     `json:"game_type" db:"GameType"`
	Sub_Match_ID            int     `json:"sub_match_id" db:"Sub_Match_ID"`
	Sub_Match_Status_Pause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	Sub_Match_Status_Open   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	Sub_Match_Status_Parlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	IsShowParlay            string  `json:"is_show_parlay" db:"isShowParlay"`
	IsShowBG                string  `json:"is_show_bg" db:"isShowBG"`
	IsEnableBG              string  `json:"is_enable_bg" db:"isEnableBG"`
	Sub_Match_Status_BG     string  `json:"sub_match_status_bg" db:"Sub_Match_Status_BG"`
	Odds                    float32 `json:"odds" db:"Odds"`
	OddsHome                float32 `json:"odds_home" db:"OddsHome"`
	OddsAway                float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc              float32 `json:"spread_perc" db:"SpreadPerc"`
	Auto_Odds               int     `json:"auto_odds" db:"Auto_Odds"`
	Display_Admin           int     `json:"display_admin" db:"Display_Admin"`
}

type MOMoreSpecial struct {
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchID              int     `json:"sub_match_id" db:"SubMatchID"`
	Sub_Match_Status_Pause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	Sub_Match_Status_Open   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	Sub_Match_Status_Parlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	IsShowParlay            string  `json:"is_show_parlay" db:"isShowParlay"`
	IsShowBG                string  `json:"is_show_bg" db:"isShowBG"`
	IsEnableBG              string  `json:"is_enable_bg" db:"isEnableBG"`
	Sub_Match_Status_BG     string  `json:"sub_match_status_bg" db:"Sub_Match_Status_BG"`
	Odds1                   float32 `json:"odds1" db:"Odds1"`
	Odds2                   float32 `json:"odds2" db:"Odds2"`
	Odds3                   float32 `json:"odds3" db:"Odds3"`
	Odds4                   float32 `json:"odds4" db:"Odds4"`
	Odds5                   float32 `json:"odds5" db:"Odds5"`
	Odds6                   float32 `json:"odds6" db:"Odds6"`
	Odds7                   float32 `json:"odds7" db:"Odds7"`
	Odds8                   float32 `json:"odds8" db:"Odds8"`
	Odds9                   float32 `json:"odds9" db:"Odds9"`
	Odds10                  float32 `json:"odds10" db:"Odds10"`
	IsShowMargin            string  `json:"is_show_margin" db:"isShowMargin"`
	IsShowMargin2           string  `json:"is_show_margin2" db:"isShowMargin2"`
	ST_OddsMargin           string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	ST_OddsMargin2          string  `json:"st_odds_margin2" db:"ST_OddsMargin2"`
	OddsMargin              float32 `json:"odds_margin" db:"OddsMargin"`
	OddsMargin2             float32 `json:"odds_margin2" db:"OddsMargin2"`
	Handicap                float32 `json:"handicap" db:"Handicap"`
}

type MOMoreCS struct {
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchID              int     `json:"sub_match_id" db:"SubMatchID"`
	Sub_Match_Status_Pause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	Sub_Match_Status_Open   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	Sub_Match_Status_Parlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	IsShowParlay            string  `json:"is_show_parlay" db:"isShowParlay"`
	IsShowBG                string  `json:"is_show_bg" db:"isShowBG"`
	IsEnableBG              string  `json:"is_enable_bg" db:"isEnableBG"`
	Sub_Match_Status_BG     string  `json:"sub_match_status_bg" db:"Sub_Match_Status_BG"`
	Odds1                   float64 `json:"odds1" db:"Odds1"`
	Odds2                   float64 `json:"odds2" db:"Odds2"`
	Odds3                   float64 `json:"odds3" db:"Odds3"`
	Odds4                   float64 `json:"odds4" db:"Odds4"`
	Odds5                   float64 `json:"odds5" db:"Odds5"`
	Odds6                   float64 `json:"odds6" db:"Odds6"`
	Odds7                   float64 `json:"odds7" db:"Odds7"`
	Odds8                   float64 `json:"odds8" db:"Odds8"`
	Odds9                   float64 `json:"odds9" db:"Odds9"`
	Odds10                  float64 `json:"odds10" db:"Odds10"`
	Odds11                  float64 `json:"odds11" db:"Odds11"`
	Odds12                  float64 `json:"odds12" db:"Odds12"`
	Odds13                  float64 `json:"odds13" db:"Odds13"`
	Odds14                  float64 `json:"odds14" db:"Odds14"`
	Odds15                  float64 `json:"odds15" db:"Odds15"`
	Odds16                  float64 `json:"odds16" db:"Odds16"`
	Odds17                  float64 `json:"odds17" db:"Odds17"`
	Odds18                  float64 `json:"odds18" db:"Odds18"`
	Odds19                  float64 `json:"odds19" db:"Odds19"`
	Odds20                  float64 `json:"odds20" db:"Odds20"`
	Odds21                  float64 `json:"odds21" db:"Odds21"`
	Odds22                  float64 `json:"odds22" db:"Odds22"`
	Odds23                  float64 `json:"odds23" db:"Odds23"`
	Odds24                  float64 `json:"odds24" db:"Odds24"`
	Odds25                  float64 `json:"odds25" db:"Odds25"`
	Odds26                  float64 `json:"odds26" db:"Odds26"`
	Odds27                  float64 `json:"odds27" db:"Odds27"`
	ST_OddsMargin           string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin              float64 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin            string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreCSLive struct {
	GameType                int     `json:"game_type" db:"GameType"`
	SubMatchID              int     `json:"sub_match_id" db:"SubMatchID"`
	Sub_Match_Status_Pause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	Sub_Match_Status_Open   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	Sub_Match_Status_Parlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	IsShowParlay            string  `json:"is_show_parlay" db:"isShowParlay"`
	IsShowBG                string  `json:"is_show_bg" db:"isShowBG"`
	IsEnableBG              string  `json:"is_enable_bg" db:"isEnableBG"`
	Sub_Match_Status_BG     string  `json:"sub_match_status_bg" db:"Sub_Match_Status_BG"`
	HomeScore               int     `json:"home_score" db:"HomeScore"`
	AwayScore               int     `json:"away_score" db:"AwayScore"`
	Score                   string  `json:"score" db:"Score"`
	Odds                    float64 `json:"odds" db:"Odds"`
	ChoiceCode              string  `json:"choice_code" db:"ChoiceCode"`
	Total                   int     `json:"total" db:"Total"`
	TotalBet                float64 `json:"total_bet" db:"TotalBet"`
}

type MOMoreBasketHT1 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketHT2 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketHT3 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketHT4 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	Odds11               float32 `json:"odds11" db:"Odds11"`
	Odds12               float32 `json:"odds12" db:"Odds12"`
	Odds13               float32 `json:"odds13" db:"Odds13"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketHT5 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketFT1 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketFT2 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketFT3 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	Odds11               float32 `json:"odds11" db:"Odds11"`
	Odds12               float32 `json:"odds12" db:"Odds12"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketFT4 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	Odds11               float32 `json:"odds11" db:"Odds11"`
	Odds12               float32 `json:"odds12" db:"Odds12"`
	Odds13               float32 `json:"odds13" db:"Odds13"`
	Odds14               float32 `json:"odds14" db:"Odds14"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketFT5 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT1 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT2 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT3 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	Odds11               float32 `json:"odds11" db:"Odds11"`
	Odds12               float32 `json:"odds12" db:"Odds12"`
	Odds13               float32 `json:"odds13" db:"Odds13"`
	Odds14               float32 `json:"odds14" db:"Odds14"`
	Odds15               float32 `json:"odds15" db:"Odds15"`
	Odds16               float32 `json:"odds16" db:"Odds16"`
	Odds17               float32 `json:"odds17" db:"Odds17"`
	Odds18               float32 `json:"odds18" db:"Odds18"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT4 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT5 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	STFav                int     `json:"st_fav" db:"ST_Fav"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT6 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT7 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketMainQT8 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	Odds11               float32 `json:"odds11" db:"Odds11"`
	Odds12               float32 `json:"odds12" db:"Odds12"`
	Odds13               float32 `json:"odds13" db:"Odds13"`
	Odds14               float32 `json:"odds14" db:"Odds14"`
	Odds15               float32 `json:"odds15" db:"Odds15"`
	Odds16               float32 `json:"odds16" db:"Odds16"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketSubQT1 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	STFav                int     `json:"st_fav" db:"ST_Fav"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketSubQT2 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketSubQT3 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketSubQT4 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketSubQT5 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	Odds8                float32 `json:"odds8" db:"Odds8"`
	Odds9                float32 `json:"odds9" db:"Odds9"`
	Odds10               float32 `json:"odds10" db:"Odds10"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketSubQT6 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds1                float32 `json:"odds1" db:"Odds1"`
	Odds2                float32 `json:"odds2" db:"Odds2"`
	Odds3                float32 `json:"odds3" db:"Odds3"`
	Odds4                float32 `json:"odds4" db:"Odds4"`
	Odds5                float32 `json:"odds5" db:"Odds5"`
	Odds6                float32 `json:"odds6" db:"Odds6"`
	Odds7                float32 `json:"odds7" db:"Odds7"`
	STOddsMargin         string  `json:"st_odds_margin" db:"ST_OddsMargin"`
	OddsMargin           float32 `json:"odds_margin" db:"OddsMargin"`
	IsShowMargin         string  `json:"is_show_margin" db:"isShowMargin"`
}

type MOMoreBasketSubQT7 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type MOMoreBasketSubQT8 struct {
	GameType             int     `json:"game_type" db:"GameType"`
	SubMatchID           int     `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchStatusPause  int     `json:"sub_match_status_pause" db:"Sub_Match_Status_Pause"`
	SubMatchStatusOpen   string  `json:"sub_match_status_open" db:"Sub_Match_Status_Open"`
	SubMatchStatusParlay string  `json:"sub_match_status_parlay" db:"Sub_Match_Status_Parlay"`
	Handicap             float32 `json:"handicap" db:"Handicap"`
	Odds                 float32 `json:"odds" db:"Odds"`
	OddsHome             float32 `json:"odds_home" db:"OddsHome"`
	OddsAway             float32 `json:"odds_away" db:"OddsAway"`
	SpreadPerc           int     `json:"spread_perc" db:"SpreadPerc"`
}

type AutoCloseAutoTimer struct {
	IsShowAutoClose string `json:"is_show_auto_close" db:"ShowAutoClose"`
	IsShowAutoTimer string `json:"is_show_auto_timer" db:"ShowAutoTimer"`
	StatusAutoClose string `json:"status_auto_close" db:"ST_AutoClose"`
	StatusAutoTimer string `json:"status_auto_timer" db:"ST_AutoTimer"`
}

type BasketTimer struct {
	EvRound     int    `json:"match_round" db:"EvRound"`
	STStopTimer string `json:"st_stop_timer" db:"ST_StopTimer"`
	Minutes     int    `json:"minutes" db:"Minutes"`
	Seconds     int    `json:"seconds" db:"Seconds"`
}

type MOScoring struct {
	MatchID       int    `json:"match_id" db:"Match_ID"`
	HTProcess     string `json:"ht_process" db:"HT_Process"`
	FTProcess     string `json:"ft_process" db:"FT_Process"`
	FGLGProcess   string `json:"fglg_process" db:"FGLG_Process"`
	HTHomeScore   int    `json:"ht_home_score" db:"HT_Home_Score"`
	HTAwayScore   int    `json:"ht_away_score" db:"HT_Away_Score"`
	FSHomeScore   int    `json:"fs_home_score" db:"FS_Home_Score"`
	FSAwayScore   int    `json:"fs_away_score" db:"FS_Away_Score"`
	FGLGFirstGoal int    `json:"fglg_first_goal" db:"FGLG_First_Goal"`
	FGLGLastGoal  int    `json:"fglg_last_goal" db:"FGLG_Last_Goal"`
	FGLGCount     int    `json:"fglg_count" db:"FGLG_Count"`
}
