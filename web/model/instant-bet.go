package model

import "github.com/guregu/null"

type InstantBet struct {
	ID                int         `json:"id" db:"ID"`
	PBetID            null.String `json:"p_bet_id" db:"PBetID"`
	BetID             int         `json:"bet_id" db:"BetID"`
	MatchDate         null.String `json:"match_date" db:"MatchDate"`
	BetDate           string      `json:"bet_date" db:"BetDate"`
	Username          string      `json:"username" db:"Username"`
	VIPCode           string      `json:"vip_code" db:"VIPCode"`
	VIPTimer          int         `json:"vip_timer" db:"VIPTimer"`
	BranchAlias       string      `json:"branch_alias" db:"BranchAlias"`
	LeagueName        string      `json:"league_name" db:"LeagueName"`
	MatchID           int         `json:"match_id" db:"MatchID"`
	ParlaySeq         int         `json:"parlay_seq" db:"ParlaySeq"`
	HomeName          string      `json:"home_name" db:"HomeTeam"`
	AwayName          string      `json:"away_name" db:"AwayTeam"`
	STFav             int         `json:"st_fav" db:"ST_Fav"`
	STLive            string      `json:"st_live" db:"ST_Live"`
	BetChoice         string      `json:"bet_choice" db:"BetCode"`
	Handicap          float32     `json:"handicap" db:"Handicap"`
	Odds              float32     `json:"odds" db:"Odds"`
	OddsType          int         `json:"odds_type" db:"OddsType"`
	HomePosisi        int         `json:"home_posisi" db:"HomePosisi"`
	AwayPosisi        int         `json:"away_posisi" db:"AwayPosisi"`
	GameType          int         `json:"game_type" db:"GameType"`
	Currency          string      `json:"currency" db:"Currency"`
	BetAmountComp     float32     `json:"bet_amount_comp" db:"Bet_Amount_Comp"`
	BetAmount         float32     `json:"bet_amount" db:"Bet_Amount"`
	IP                string      `json:"ip" db:"IP"`
	Country           string      `json:"country" db:"Country"`
	Status            int         `json:"status" db:"Status"`
	VoidID            int         `json:"void_id" db:"Void_ID"`
	VoidUser          null.String `json:"void_user" db:"Void_User"`
	VoidDate          null.String `json:"void_date" db:"Void_Date"`
	VoidDesc          null.String `json:"void_desc" db:"Void_Desc"`
	EarlyCounter      null.Int    `json:"early_counter" db:"EarlyCounter"`
	SignUpWeek        int         `json:"sign_up_week" db:"SignUpWeek"`
	NeutralGround     string      `json:"neutral_ground" db:"Neutral_Ground"`
	CompType          string      `json:"comp_type" db:"CompType"`
	EvRound           int         `json:"ev_round" db:"EvRound"`
	RobotScore        int         `json:"robot_score" db:"RobotScore"`
	LimitProfileID    string      `json:"limit_profile_id" db:"LimitProfileID"`
	SSMA              string      `json:"ssma" db:"SSMA"`
	IsLongPending     int         `json:"is_long_pending" db:"IsLongPending"`
	StatusTicket      int         `json:"status_ticket" db:"StatusTicket"`
	IsParlayLive      int         `json:"is_parlay_live" db:"IsParlayLive"`
	Win               float32     `json:"win" db:"Win"`
	Loss              float32     `json:"loss" db:"Loss"`
	ParlayComboTicket int         `json:"parlay_combo_ticket" db:"ParlayComboTicket"`
	TxnType           string      `json:"txn_type" db:"Txn_Type"`
	StampUser         null.String `json:"stamp_user" db:"StampUser"`
	AcRjDate          null.String `json:"acrj_date" db:"AcRj_Date"`
	PendingTimes      null.String `json:"pending_times" db:"Pending_Times"`
	GameTypeName_BTI  null.String `json:"game_type_name_bti" db:"GameTypeName_BTI"`
	ChoiceName_BTI    null.String `json:"choice_name_bti" db:"ChoiceName_BTI"`
}

type InstantBetParlay struct {
	LeagueName string  `json:"league_name" db:"League"`
	HomeTeam   string  `json:"home_name" db:"Home"`
	AwayTeam   string  `json:"away_name" db:"Away"`
	STFav      int     `json:"st_fav" db:"ST_Fav"`
	BetChoice  string  `json:"bet_choice" db:"Choose"`
	GameType   int     `json:"game_type" db:"GameType"`
	HomeScore  int     `json:"home_score" db:"Home_Score"`
	AwayScore  int     `json:"away_score" db:"Away_Score"`
	Handicap   float32 `json:"handicap" db:"Handicap"`
	Odds       float32 `json:"odds" db:"Odds"`
	NoTxn      int     `json:"no_txn" db:"Txn_No"`
}

type InstantBetLottery struct {
	JackpotID  int     `json:"jackpot_id" db:"JpID"`
	LotteryID  int     `json:"lottery_id" db:"LotteryID"`
	MatchID    int     `json:"match_id" db:"No_Partai"`
	LeagueName string  `json:"league_name" db:"League"`
	HomeTeam   string  `json:"home_name" db:"Home"`
	AwayTeam   string  `json:"away_name" db:"Away"`
	GameType   int     `json:"game_type" db:"GameType"`
	Handicap   float32 `json:"handicap" db:"Handicap"`
	Choice     string  `json:"choice" db:"Choice"`
}
