package model

import (
	"github.com/shopspring/decimal"
)

type ProfileSelect struct {
	ProfileID string `json:"profile_id" db:"Profile_ID"`
	OrderBy   int    `json:"orderby" db:"OrderBy"`
}

type ProfileOddsTrigger struct {
	LimitID            string          `json:"limit_id" db:"LimitID"`
	GameType           int             `json:"game_type" db:"GameType"`
	OddsTriggerID      int             `json:"odds_trigger_id" db:"OddsTriggerID"`
	OddsFrom           decimal.Decimal `json:"odds_from" db:"OddsFrom"`
	OddsTo             decimal.Decimal `json:"odds_to" db:"OddsTo"`
	OddsTriggerPercent decimal.Decimal `json:"odds_trigger_percent" db:"OddsTriggerPercent"`
}

type EventLimit struct {
	GameType_Sequence int             `json:"game_type_sequence" db:"GameType_Sequence"`
	GameType          int             `json:"game_type" db:"GameType"`
	Step_1            int             `json:"step_1" db:"Step_1"`
	Odds_Trigger_1    decimal.Decimal `json:"odds_trigger_1" db:"Odds_Trigger_1"`
	Max_Limit_1       decimal.Decimal `json:"max_limit_1" db:"Max_Limit_1"`
	Max_Bet_1         decimal.Decimal `json:"max_bet_1" db:"Max_Bet_1"`
	Spread_1          decimal.Decimal `json:"spread_1" db:"Spread_1"`
	Step_2            int             `json:"step_2" db:"Step_2"`
	Odds_Trigger_2    decimal.Decimal `json:"odds_trigger_2" db:"Odds_Trigger_2"`
	Max_Limit_2       decimal.Decimal `json:"max_limit_2" db:"Max_Limit_2"`
	Max_Bet_2         decimal.Decimal `json:"max_bet_2" db:"Max_Bet_2"`
	Spread_2          decimal.Decimal `json:"spread_2" db:"Spread_2"`
	Step_3            int             `json:"step_3" db:"Step_3"`
	Odds_Trigger_3    decimal.Decimal `json:"odds_trigger_3" db:"Odds_Trigger_3"`
	Max_Limit_3       decimal.Decimal `json:"max_limit_3" db:"Max_Limit_3"`
	Max_Bet_3         decimal.Decimal `json:"max_bet_3" db:"Max_Bet_3"`
	Spread_3          decimal.Decimal `json:"spread_3" db:"Spread_3"`
	Step_4            int             `json:"step_4" db:"Step_4"`
	Odds_Trigger_4    decimal.Decimal `json:"odds_trigger_4" db:"Odds_Trigger_4"`
	Max_Limit_4       decimal.Decimal `json:"max_limit_4" db:"Max_Limit_4"`
	Max_Bet_4         decimal.Decimal `json:"max_bet_4" db:"Max_Bet_4"`
	Spread_4          decimal.Decimal `json:"spread_4" db:"Spread_4"`
}

type Payout struct {
	League_Profile    string          `json:"league_profile" db:"League_Profile"`
	GameType          int             `json:"game_type" db:"GameType"`
	Max_Bet           decimal.Decimal `json:"max_bet" db:"Max_Bet"`
	Max_Payout        decimal.Decimal `json:"max_payout" db:"Max_Payout"`
	Spread            decimal.Decimal `json:"spread" db:"Spread"`
	Is_Live           string          `json:"is_live" db:"Is_Live"`
	LAP               decimal.Decimal `json:"lap" db:"LAP"`
	Amount_Trigger    decimal.Decimal `json:"amount_trigger" db:"Amount_Trigger"`
	Max_Payout_Ticket decimal.Decimal `json:"max_payout_ticket" db:"Max_Payout_Ticket"`
}

type PayoutSpec struct {
	League_Profile        string          `json:"league_profile" db:"League_Profile"`
	GameTypeSpec          int             `json:"game_type_spec" db:"GameTypeSpec"`
	Max_PayoutSpec        decimal.Decimal `json:"max_payout_spec" db:"Max_PayoutSpec"`
	SpreadSpec            decimal.Decimal `json:"spread_spec" db:"SpreadSpec"`
	IS_LiveSpec           string          `json:"is_live_spec" db:"IS_LiveSpec"`
	LAPSpec               decimal.Decimal `json:"lap_spec" db:"LAPSpec"`
	Max_BetSpec           decimal.Decimal `json:"max_bet_spec" db:"Max_BetSpec"`
	Amount_TriggerSpec    decimal.Decimal `json:"amount_trigger_spec" db:"Amount_TriggerSpec"`
	No_Display            decimal.Decimal `json:"no_display" db:"No_Display"`
	Max_PayoutSpec_Ticket decimal.Decimal `json:"max_payout_spec_ticket" db:"Max_PayoutSpec_Ticket"`
}

type ResultTableProfile struct {
	ResultEventLimit interface{} `json:"result_event_limit"`
	ResultPayout     interface{} `json:"result_payout"`
	ResultPayoutSpec interface{} `json:"result_payout_spec"`
}
