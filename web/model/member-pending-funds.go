package model

import (
	"github.com/guregu/null"
	"github.com/shopspring/decimal"
)

type PendingFund struct {
	MemberID         null.String `json:"member_id" db:"MemberID"`
	TotalTransaction null.Int    `json:"total_transaction" db:"TotalTransaction"`
	TotalPending     null.Float  `json:"total_pending" db:"TotalPending"`
}

type PFDailyStatement struct {
	Report_Date string  `json:"report_date" db:"Report_Date"`
	Remark      string  `json:"remark" db:"Remark"`
	TurnOver    float64 `json:"turn_over" db:"TurnOver"`
	DebetCredit float64 `json:"debet_credit" db:"DebetCredit"`
	Commission  float64 `json:"commission" db:"Commission"`
	Balance     float64 `json:"balance" db:"Balance"`
	Report_Type int     `json:"report_type" db:"Report_Type"`
	Posted      int     `json:"posted" db:"Posted"`
}
type PFBetSummary struct {
	Username   string      `json:"username" db:"Username"`
	EventDate  string      `json:"event_date" db:"EventDate"`
	Bet_Date   string      `json:"bet_date" db:"Bet_Date"`
	Home_Name  null.String `json:"home_name" db:"Home_Name"`
	Away_Name  null.String `json:"away_name" db:"Away_Name"`
	Bet_Choice string      `json:"bet_choice" db:"Bet_Choice"`
	GameType   int         `json:"game_type" db:"GameType"`
	Bet_Amount float64     `json:"bet_amount" db:"Bet_Amount"`
	WinLoss    float64     `json:"win_loss" db:"WinLoss"`
}
type PFBetList struct {
	Username         string          `json:"username" db:"Username"`
	Bet_Date         string          `json:"bet_date" db:"Bet_Date"`
	Nama_Sport       null.String     `json:"sport_name" db:"Nama_Sport"`
	Home_Name        null.String     `json:"home_name" db:"Home_Name"`
	Away_Name        null.String     `json:"away_name" db:"Away_Name"`
	League_Name      null.String     `json:"league_name" db:"League_Name"`
	Bet_ID           int             `json:"bet_id" db:"Bet_ID"`
	Match_ID         int             `json:"match_id" db:"Match_ID"`
	Bet_Choice       null.String     `json:"bet_choice" db:"Bet_Choice"`
	Handicap         float64         `json:"handicap" db:"Handicap"`
	Gametype         int             `json:"game_type" db:"Gametype"`
	Odds             float64         `json:"odds" db:"Odds"`
	Bet_Amount       float64         `json:"bet_amount" db:"Bet_Amount"`
	Bet_Score_Home   int             `json:"bet_score_home" db:"Bet_Score_Home"`
	Bet_Score_Away   int             `json:"bet_score_away" db:"Bet_Score_Away"`
	OddsType         int             `json:"odds_type" db:"Bet_Type"` // fix bet type to odds type
	Bet_Commision    decimal.Decimal `json:"bet_commision" db:"Bet_Commision"`
	Bet_Live_Status  string          `json:"bet_live_status" db:"Bet_Live_Status"`
	Void_ID          null.Int        `json:"void_id" db:"Void_ID"`
	IP               string          `json:"ip" db:"IP"`
	Currency         string          `json:"currency" db:"Currency"`
	WinLoss          float64         `json:"winloss_amount" db:"WinLoss"`
	Result           null.String     `json:"result" db:"Result"`
	MOdds            string          `json:"m_odds" db:"MOdds"`
	WL_Status        null.String     `json:"winloss_status" db:"WL_Status"`
	Txn_Mode         string          `json:"txn_mode" db:"Txn_Mode"`
	First_Goal       null.Int        `json:"first_goal" db:"First_Goal"`
	Last_Goal        null.Int        `json:"last_goal" db:"Last_Goal"`
	MGameType        int             `json:"m_game_type" db:"MGameType"`
	Urut             int             `json:"urut" db:"Urut"`
	BetBuilderMarket null.String     `json:"bet_builder_market" db:"BetBuilderMarket"`
	GameTypeNameBTI  null.String     `json:"game_type_name_bti" db:"GameTypeName_BTI"`
	ChoiceNameBTI    null.String     `json:"choice_name_bti" db:"ChoiceName_BTI"`
}
type PFBetListRunning struct {
	PFBetList
}
