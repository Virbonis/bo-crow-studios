package model

import "github.com/guregu/null"

type AcceptReject struct {
	PBetID        string      `json:"p_bet_id" db:"PBetID"`
	BetID         int         `json:"bet_id" db:"BetID"`
	BetDate       string      `json:"bet_date" db:"BetDate"`
	Username      string      `json:"username" db:"Username"`
	VIPCode       string      `json:"vip_code" db:"VIPCode"`
	BranchAlias   string      `json:"branch_alias" db:"BranchAlias"`
	LeagueName    string      `json:"league_name" db:"LeagueName"`
	MatchID       int         `json:"match_id" db:"MatchID"`
	ParlaySeq     int         `json:"parlay_seq" db:"ParlaySeq"`
	HomeTeam      string      `json:"home_name" db:"HomeTeam"`
	AwayTeam      string      `json:"away_name" db:"AwayTeam"`
	STFav         int         `json:"st_fav" db:"ST_Fav"`
	STLive        string      `json:"bet_live_status" db:"ST_Live"`
	BetCode       string      `json:"bet_choice" db:"BetCode"`
	Handicap      float64     `json:"handicap" db:"Handicap"`
	Odds          float64     `json:"odds" db:"Odds"`
	OddsType      string      `json:"odds_type" db:"OddsType"`
	HomePosisi    int         `json:"bet_score_home" db:"HomePosisi"`
	AwayPosisi    int         `json:"bet_score_away" db:"AwayPosisi"`
	GameType      int         `json:"game_type" db:"GameType"`
	Currency      string      `json:"currency" db:"Currency"`
	BetAmountComp float64     `json:"bet_amount_comp" db:"Bet_Amount_Comp"`
	BetAmount     float64     `json:"bet_amount" db:"Bet_Amount"`
	IP            string      `json:"ip" db:"IP"`
	Country       null.String `json:"country" db:"Country"`
	Status        int         `json:"status" db:"Status"`
	VoidID        int         `json:"void_id" db:"Void_ID"`
	VoidUser      null.String `json:"void_user" db:"Void_User"`
	VoidDate      null.String `json:"void_date" db:"Void_Date"`
	VoidDesc      null.String `json:"void_desc" db:"Void_Desc"`
	RobotScore    int         `json:"robot_score" db:"RobotScore"`
	IsParlayLive  int         `json:"is_parlay_live" db:"IsParlayLive"`
}

type AcceptRejectView struct {
	AcceptReject

	DateRejectAccept string `json:"date_reject_accept" db:"DateRejectAccept"`
	PendingTime      string `json:"pending_time" db:"PendingTime"`
	TraderName       string `json:"trader_name" db:"TraderName"`
	EarlyCounter     int    `json:"early_counter" db:"EarlyCounter"`
	CompType         string `json:"comp_type" db:"CompType"`
	EvRound          int    `json:"ev_round" db:"EvRound"`
}
