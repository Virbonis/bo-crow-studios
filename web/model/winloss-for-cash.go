package model

import "github.com/guregu/null"

type WinlossForCash struct {
	Customer_ID         int     `json:"customer_id" db:"Customer_ID"`
	Username            string  `json:"username" db:"Username"`
	Customer_Level      string  `json:"customer_level" db:"Customer_Level"`
	Bets_Count          int     `json:"bets_count" db:"Bets_Count"`
	Member_Count        int     `json:"member_count" db:"Member_Count"`
	Currency            string  `json:"currency" db:"Currency"`
	Bet_Amount          float64 `json:"bet_amount" db:"Bet_Amount"`
	Bet_Amount_RMB      float64 `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	Winloss_Member      float64 `json:"winloss_member" db:"Winloss_Member"`
	Winloss_Member_RMB  float64 `json:"winloss_member_rmb" db:"Winloss_Member_RMB"`
	Winloss_Company     float64 `json:"winloss_company" db:"Winloss_Company"`
	Winloss_Company_RMB float64 `json:"winloss_company_rmb" db:"Winloss_Company_RMB"`
	Index_Number        int     `json:"index_number" db:"Index_Number"`
}

type WinlossForCashSummary struct {
	Customer_ID         int         `json:"customer_id" db:"Customer_ID"`
	Username            null.String `json:"username" db:"Username"`
	Bets_Count          int         `json:"bets_count" db:"Bets_Count"`
	Member_Count        int         `json:"member_count" db:"Member_Count"`
	Currency            null.String `json:"currency" db:"Currency"`
	Bet_Amount          float64     `json:"bet_amount" db:"Bet_Amount"`
	Bet_Amount_RMB      float64     `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	Winloss_Member      float64     `json:"winloss_member" db:"Winloss_Member"`
	Winloss_Member_RMB  float64     `json:"winloss_member_rmb" db:"Winloss_Member_RMB"`
	Winloss_Company     float64     `json:"winloss_company" db:"Winloss_Company"`
	Winloss_Company_RMB float64     `json:"winloss_company_rmb" db:"Winloss_Company_RMB"`
	Index_Number        int         `json:"index_number" db:"Index_Number"`
}

type WinlossForCashBetDetail struct {
	Username           string      `json:"username" db:"Username"`
	Bet_ID             int         `json:"bet_id" db:"Bet_ID"`
	Bet_Type           string      `json:"bet_type" db:"Bet_Type"`
	Pending_Bet_ID     int         `json:"pending_bet_id" db:"Pending_Bet_ID"`
	Bet_Date           string      `json:"bet_date" db:"Bet_Date"`
	GameType           int         `json:"game_type" db:"GameType"`
	Bet_Live_Status    string      `json:"bet_live_status" db:"Bet_Live_Status"`
	Match_ID           int         `json:"match_id" db:"Match_ID"`
	Parlay_GameType    int         `json:"parlay_game_type" db:"Parlay_GameType"`
	Sport_Name         string      `json:"sport_name" db:"Sport_Name"`
	League_Name        string      `json:"league_name" db:"League_Name"`
	Home_Name          string      `json:"home_name" db:"Home_Name"`
	Away_Name          string      `json:"away_name" db:"Away_Name"`
	Bet_Choice         string      `json:"bet_choice" db:"Bet_Choice"`
	Odds               string      `json:"odds" db:"Odds"`
	Handicap           string      `json:"handicap" db:"Handicap"`
	Bet_Fav_Status     int         `json:"bet_fav_status" db:"Bet_Fav_Status"`
	Bet_Neutral_Status null.String `json:"bet_neutral_status" db:"Bet_Neutral_Status"`
	Bet_Commision      int         `json:"bet_commision" db:"Bet_Commision"`
	Bet_Score_Home     int         `json:"bet_score_home" db:"Bet_Score_Home"`
	Bet_Score_Away     int         `json:"bet_score_away" db:"Bet_Score_Away"`
	HT_Score_Status    null.String `json:"ht_score_status" db:"HT_Score_Status"`
	FT_Score_Status    null.String `json:"ft_score_status" db:"FT_Score_Status"`
	HT_Home            null.Int    `json:"ht_home" db:"HT_Home"`
	HT_Away            null.Int    `json:"ht_away" db:"HT_Away"`
	FS_Home            null.Int    `json:"fs_home" db:"FS_Home"`
	FS_Away            null.Int    `json:"fs_away" db:"FS_Away"`
	Currency           string      `json:"currency" db:"Currency"`
	Bet_Amount         null.Float  `json:"bet_amount" db:"Bet_Amount"`
	Bet_Amount_RMB     null.Float  `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	WinLoss_Amount     null.Float  `json:"winloss_amount" db:"WinLoss_Amount"`
	WinLoss_Amount_RMB null.Float  `json:"winloss_amount_rmb" db:"WinLoss_Amount_RMB"`
	WinLoss_Status     string      `json:"winloss_amount_status" db:"WinLoss_Status"`
	IP                 string      `json:"ip" db:"IP"`
	Parlay_Combination int         `json:"parlay_combination" db:"Parlay_Combination"`
	Folds              int         `json:"folds" db:"Folds"`
	Tickets            int         `json:"tickets" db:"Tickets"`
	BetBuilderMarket   null.String `json:"bet_builder_market" db:"BetBuilderMarket"`
	GameTypeNameBTI    null.String `json:"game_type_name_bti" db:"GameTypeName_BTI"`
	ChoiceNameBTI      null.String `json:"choice_name_bti" db:"ChoiceName_BTI"`
}

type WinlossForCashBetDetailSummary struct {
	BetAmountRMB     null.Float `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	WinlossAmountRMB null.Float `json:"winloss_amount_rmb" db:"WinLoss_Amount_RMB"`
}
