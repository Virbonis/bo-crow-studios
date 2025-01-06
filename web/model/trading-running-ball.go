package model

import "github.com/guregu/null"

type ListTradingRunningBall struct {
	SportID                  int         `json:"sport_id" db:"Sport_ID"`
	SportSequence            int         `json:"sport_sequence" db:"Sport_Sequence"`
	LeagueID                 int         `json:"league_id" db:"League_ID"`
	LeagueName               string      `json:"league_name" db:"League_Name"`
	LeagueSequence           int         `json:"league_sequence" db:"League_Sequence"`
	ProfileID                string      `json:"profile_id" db:"Profile_ID"`
	MatchID                  int         `json:"match_id" db:"Match_ID"`
	MatchDate                string      `json:"match_date" db:"Match_Date"`
	MatchLiveStatus          string      `json:"match_live_status" db:"Match_Live_Status"`
	MatchPauseStatus         int         `json:"match_pause_status" db:"Match_Pause_Status"`
	MatchOpenStatus          string      `json:"match_open_status" db:"Match_Open_Status"`
	MatchNeutralStatus       string      `json:"match_neutral_status" db:"Match_Neutral_Status"`
	MatchSequence            string      `json:"match_sequence" db:"Match_Sequence"`
	MatchRound               int         `json:"match_round" db:"Match_Round"`
	MatchElapsedTime         int         `json:"match_elapsed_time" db:"Match_Elapsed_Time"`
	HomeName                 string      `json:"home_name" db:"Home_Name"`
	AwayName                 string      `json:"away_name" db:"Away_Name"`
	HomePosisi               int         `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi               int         `json:"away_posisi" db:"Away_Posisi"`
	HomeRC                   int         `json:"home_rc" db:"Home_RC"`
	AwayRC                   int         `json:"away_rc" db:"Away_RC"`
	SubMatchID               int         `json:"sub_match_id" db:"Sub_Match_ID"`
	SubMatchOpenStatus       string      `json:"sub_match_open_status" db:"Sub_Match_Open_Status"`
	SubMatchPauseStatus      int         `json:"sub_match_pause_status" db:"Sub_Match_Pause_Status"`
	SubMatchFavStatus        int         `json:"sub_match_fav_status" db:"Sub_Match_Fav_Status"`
	SubMatchOddsStep         int         `json:"sub_match_odds_step" db:"Sub_Match_Odds_Step"`
	GameType                 int         `json:"game_type" db:"GameType"`
	Handicap                 float64     `json:"handicap" db:"Handicap"`
	OddsHome                 float64     `json:"odds_home" db:"OddsHome"`
	OddsAway                 float64     `json:"odds_away" db:"OddsAway"`
	JmlHome                  float64     `json:"jml_home" db:"JmlHome"`
	JmlAway                  float64     `json:"jml_away" db:"JmlAway"`
	THome                    float64     `json:"t_home" db:"THome"`
	TAway                    float64     `json:"t_away" db:"TAway"`
	JmlPendHome              float64     `json:"jml_pend_home" db:"JmlPendHome"`
	JmlPendAway              float64     `json:"jml_pend_away" db:"JmlPendAway"`
	TPendHome                float64     `json:"t_pend_home" db:"TPendHome"`
	TPendAway                float64     `json:"t_pend_away" db:"TPendAway"`
	Type                     int         `json:"type" db:"Type"`
	PriceAlert               int         `json:"price_alert" db:"Price_Alert"`
	PriceAlertTrader         int         `json:"price_alert_trader" db:"Price_Alert_Trader"`
	TraderGroup              string      `json:"trader_group" db:"TraderGroup"`
	TraderGroupPause         string      `json:"trader_group_pause" db:"TraderGroupPause"`
	LastChange               string      `json:"last_change" db:"LastChange"`
	ReasonPause              string      `json:"reason_pause" db:"Reason_Pause"`
	AutoOdds                 int         `json:"auto_odds" db:"Auto_Odds"`
	LockShift                int         `json:"lock_shift" db:"Lock_Shift"`
	AutoPause                int         `json:"auto_pause" db:"Auto_Pause"`
	IsProfileChanged         int         `json:"is_profile_changed" db:"Is_Profile_Changed"`
	IsMatchConfirmed         string      `json:"is_match_confirmed" db:"Is_Match_Confirmed"`
	LastUpdateSecond         string      `json:"last_update_second" db:"LastUpdateSecond"`
	LastAcceptPendingTickets null.String `json:"last_accept_pending_tickets" db:"Last_Accept_Pending_Tickets"`
	PendingMatches           string      `json:"pending_matches" db:"Pending_Matches"`
	SortIndex                string      `json:"sort_index" db:"SortIndex"`
}

type ListPendingSummary struct {
	OrderID   int    `json:"order_id" db:"OrderID"`
	BetsCount int    `json:"bets_count" db:"Bets_Count"`
	BetChoice string `json:"bet_choice" db:"Bet_Choice"`
	StakeRMB  int    `json:"stake_rmb" db:"Stake_RMB"`
}

type ListPAR struct {
	Username    string  `json:"username" db:"Username"`
	GameType    int     `json:"game_type" db:"GameType"`
	Handicap    float64 `json:"handicap" db:"Handicap"`
	Odds        float64 `json:"odds" db:"Odds"`
	BetChoice   string  `json:"bet_choice" db:"Bet_Choice"`
	Team        string  `json:"team" db:"Team"`
	HomePosisi  int     `json:"home_posisi" db:"Home_Posisi"`
	AwayPosisi  int     `json:"away_posisi" db:"Away_Posisi"`
	Currency    string  `json:"currency" db:"Currency"`
	BetAmount   float64 `json:"bet_amount" db:"Bet_Amount"`
	Color       string  `json:"color" db:"Color"`
	AcceptTimer int     `json:"accept_timer" db:"Accept_Timer"`
}
