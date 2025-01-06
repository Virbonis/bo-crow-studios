package model

import "github.com/guregu/null"

type CancelBet struct {
	Username         string      `json:"username" db:"Username"`
	Bet_Date         string      `json:"bet_date" db:"Bet_Date"`
	SportName        null.String `json:"sport_name" db:"Nama_Sport"`
	Home_Name        null.String `json:"home_name" db:"Home_Name"`
	Away_Name        null.String `json:"away_name" db:"Away_Name"`
	League_Name      null.String `json:"league_name" db:"League_Name"`
	Bet_ID           int         `json:"bet_id" db:"Bet_ID"`
	Match_ID         int         `json:"match_id" db:"Match_ID"`
	Bet_Choice       string      `json:"bet_choice" db:"Bet_Choice"`
	Handicap         float64     `json:"handicap" db:"Handicap"`
	Gametype         int         `json:"game_type" db:"Gametype"`
	Odds             float64     `json:"odds" db:"Odds"`
	Bet_Amount       float64     `json:"bet_amount" db:"Bet_Amount"`
	Bet_Score_Home   int         `json:"bet_score_home" db:"Bet_Score_Home"`
	Bet_Score_Away   int         `json:"bet_score_away" db:"Bet_Score_Away"`
	OddsType         int         `json:"odds_type" db:"Bet_Type"` // fix bet type to odds type
	Bet_Commision    int         `json:"bet_commision" db:"Bet_Commision"`
	Bet_Live_Status  string      `json:"bet_live_status" db:"Bet_Live_Status"`
	Void_ID          int         `json:"void_id" db:"Void_ID"`
	IP               string      `json:"ip" db:"IP"`
	Currency         string      `json:"currency" db:"Currency"`
	WinLoss          float64     `json:"winloss" db:"WinLoss"`
	Result           null.String `json:"result" db:"Result"`
	MOdds            float64     `json:"m_odds" db:"MOdds"`
	WL_Status        string      `json:"winloss_status" db:"WL_Status"`
	Txn_Mode         string      `json:"txn_mode" db:"Txn_Mode"`
	First_Goal       null.Int    `json:"first_goal" db:"First_Goal"`
	Last_Goal        null.Int    `json:"last_goal" db:"Last_Goal"`
	MGameType        int         `json:"m_game_type" db:"MGameType"`
	BetBuilderMarket null.String `json:"bet_builder_market" db:"BetBuilderMarket"`
	GameTypeNameBTI  null.String `json:"game_type_name_bti"`
	ChoiceNameBTI    null.String `json:"choice_name_bti"`
}

type CancelBetUser struct {
	Username string `json:"username" db:"Username"`
	Total    int    `json:"total" db:"Total"`
}
