package model

type SubMatchProfile struct {
	SubMatchID   int     `json:"sub_match_id" db:"SubMatchID"`
	MatchID      int     `json:"match_id" db:"MatchID"`
	Bet          float64 `json:"bet" db:"Bet"`
	Limit        float64 `json:"limit" db:"Limit"`
	Change       float64 `json:"change" db:"Change"`
	Step1        int     `json:"step1" db:"Step_1"`
	Step2        int     `json:"step2" db:"Step_2"`
	Step3        int     `json:"step3" db:"Step_3"`
	Step4        int     `json:"step4" db:"Step_4"`
	OddsTrigger1 float64 `json:"odds_trigger1" db:"Odds_Trigger_1"`
	OddsTrigger2 float64 `json:"odds_trigger2" db:"Odds_Trigger_2"`
	OddsTrigger3 float64 `json:"odds_trigger3" db:"Odds_Trigger_3"`
	OddsTrigger4 float64 `json:"odds_trigger4" db:"Odds_Trigger_4"`
	MaxLimit1    float64 `json:"max_limit1" db:"Max_Limit_1"`
	MaxLimit2    float64 `json:"max_limit2" db:"Max_Limit_2"`
	MaxLimit3    float64 `json:"max_limit3" db:"Max_Limit_3"`
	MaxLimit4    float64 `json:"max_limit4" db:"Max_Limit_4"`
	MaxBet1      float64 `json:"max_bet1" db:"Max_Bet_1"`
	MaxBet2      float64 `json:"max_bet2" db:"Max_Bet_2"`
	MaxBet3      float64 `json:"max_bet3" db:"Max_Bet_3"`
	MaxBet4      float64 `json:"max_bet4" db:"Max_Bet_4"`
	LAP1         float64 `json:"lap1" db:"LAP_1"`
	LAP2         float64 `json:"lap2" db:"LAP_2"`
	LAP3         float64 `json:"lap3" db:"LAP_3"`
	LAP4         float64 `json:"lap4" db:"LAP_4"`
}
