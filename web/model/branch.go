package model

type Branch struct {
	BranchID      string `json:"branch_id" db:"Branch_ID"`
	BranchName    string `json:"branch_name" db:"Branch_Name"`
	OperatorEmail string `json:"operator_email" db:"Operator_Email"`
}
type BranchLimit struct {
	BranchID        string  `json:"branch_id" db:"Branch_ID"`
	BranchName      string  `json:"branch_name" db:"Branch_Name"`
	Currency        string  `json:"currency" db:"Currency"`
	MinBet          float64 `json:"min_bet" db:"MinBet"`
	MinBetParlay    float64 `json:"min_bet_parlay" db:"MinBet_Parlay"`
	MaxPayoutParlay float64 `json:"max_payout_parlay" db:"MaxPayout_Parlay"`
}

type BranchSportLimit struct {
	SportID           string  `json:"sport_id" db:"SportID"`
	SportName         string  `json:"sport_name" db:"SportName"`
	MinBet_LiveStream float64 `json:"min_bet_live_stream" db:"MinBet_LiveStream"`
	No_Display        *int    `json:"no_display" db:"No_Display"`
}
type GridBranch struct {
	HostID                string  `json:"host_id" db:"Host_ID"`
	BranchID              string  `json:"branch_id" db:"Branch_ID"`
	BranchName            string  `json:"branch_name" db:"Branch_Name"`
	CustomerPrefix        string  `json:"customer_prefix" db:"Customer_Prefix"`
	MaxBetMultiplier      float64 `json:"max_bet_multiplier" db:"Max_Bet_Multiplier"`
	OddsTriggerMultiplier float64 `json:"odds_trigger_multiplier" db:"Odds_Trigger_Multiplier"`
	PauseMultiplier       float64 `json:"pause_multiplier" db:"Pause_Multiplier"`
	STOperatorLiveStream  string  `json:"st_operator_live_stream" db:"ST_OperatorLiveStream"`
}
