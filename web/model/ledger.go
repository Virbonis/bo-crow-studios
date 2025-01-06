package model

import "github.com/guregu/null"

type ReportLedgerMain struct {
	DrillID         null.String `json:"drill_id" db:"Drill_ID"`
	Desc            null.String `json:"desc" db:"Desc"`
	BetsCount       float64     `json:"bets_count" db:"Bets_Count"`
	BetAmountRMB    float64     `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	CompanyStockRMB float64     `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	Member          float64     `json:"member" db:"Member"`
	AgentResult     int         `json:"agent_result" db:"Agent_Result"`
	MAResult        int         `json:"ma_result" db:"MA_Result"`
	SMAResult       int         `json:"sma_result" db:"SMA_Result"`
	SSMAResult      int         `json:"ssma_result" db:"SSMA_Result"`
	CompanyResult   float64     `json:"company_result" db:"Company_Result"`
	Status7         string      `json:"status7" db:"Status7"`
	OrderNo         null.Int    `json:"order_no" db:"Order_No"`
	NoDisplay       null.Int    `json:"no_display" db:"No_Display"`
}
type ReportLedgerMainMember struct {
	DrillID         string  `json:"drill_id" db:"Drill_ID"`
	Desc            string  `json:"desc" db:"Desc"`
	BetsCount       float64 `json:"bets_count" db:"Bets_Count"`
	BetAmountRMB    float64 `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	CompanyStockRMB float64 `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	Member_F        float64 `json:"member_f" db:"Member_F"`
	Member_L        float64 `json:"member_l" db:"Member_L"`
	Member          float64 `json:"member" db:"Member"`
	AgentResultPerc float64 `json:"agent_result_perc" db:"Agent_Result_Perc"`
	AgentResult     int     `json:"agent_result" db:"Agent_Result"`
	MAResult        int     `json:"ma_result" db:"MA_Result"`
	SMAResult       int     `json:"sma_result" db:"SMA_Result"`
	SSMAResult      int     `json:"ssma_result" db:"SSMA_Result"`
	CompanyResult   float64 `json:"company_result" db:"Company_Result"`
	Status7         string  `json:"status7" db:"Status7"`
	OrderNo         int     `json:"order_no" db:"Order_No"`
}

type ReportLedgerAverage struct {
	DrillID            string  `json:"drill_id" db:"Drill_ID"`
	Desc               string  `json:"desc" db:"Desc"`
	BetsCount          float64 `json:"bets_count" db:"Bets_Count"`
	BetAmountRMB       float64 `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	AvgBetAmountRMB    float64 `json:"avg_bet_amount_rmb" db:"Avg_Bet_Amount_RMB"`
	CompanyStockRMB    float64 `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	AvgCompanyStockRMB float64 `json:"avg_company_stock_rmb" db:"Avg_Company_Stock_RMB"`
	Member             float64 `json:"member" db:"Member"`
	AgentResult        int     `json:"agent_result" db:"Agent_Result"`
	MAResult           int     `json:"ma_result" db:"MA_Result"`
	SMAResult          int     `json:"sma_result" db:"SMA_Result"`
	SSMAResult         int     `json:"ssma_result" db:"SSMA_Result"`
	CompanyResult      float64 `json:"company_result" db:"Company_Result"`
	CompanyIncentive   float64 `json:"company_incentive" db:"Company_Incentive"`
	Status7            string  `json:"status7" db:"Status7"`
	OrderNo            int     `json:"order_no" db:"Order_No"`
}
type ReportLedgerAvgMember struct {
	DrillID            string  `json:"drill_id" db:"Drill_ID"`
	Desc               string  `json:"desc" db:"Desc"`
	BetsCount          float64 `json:"bets_count" db:"Bets_Count"`
	BetAmountRMB       float64 `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	AvgBetAmountRMB    float64 `json:"avg_bet_amount_rmb" db:"Avg_Bet_Amount_RMB"`
	CompanyStockRMB    float64 `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	AvgCompanyStockRMB float64 `json:"avg_company_stock_rmb" db:"Avg_Company_Stock_RMB"`
	Member_F           float64 `json:"member_f" db:"Member_F"`
	Member_L           float64 `json:"member_l" db:"Member_L"`
	Member             float64 `json:"member" db:"Member"`
	AgentResultPerc    float64 `json:"agent_result_perc" db:"Agent_Result_Perc"`
	AgentResult        int     `json:"agent_result" db:"Agent_Result"`
	MAResult           int     `json:"ma_result" db:"MA_Result"`
	SMAResult          int     `json:"sma_result" db:"SMA_Result"`
	SSMAResult         int     `json:"ssma_result" db:"SSMA_Result"`
	CompanyResult      float64 `json:"company_result" db:"Company_Result"`
	CompanyIncentive   float64 `json:"company_incentive" db:"Company_Incentive"`
	Status7            string  `json:"status7" db:"Status7"`
	OrderNo            int     `json:"order_no" db:"Order_No"`
}

type ReportLedgerBetDetail struct {
	Username         string      `json:"username" db:"Username"`
	BetID            int         `json:"bet_id" db:"Bet_ID"`
	BetDate          string      `json:"bet_date" db:"Bet_Date"`
	Gametype         int         `json:"game_type" db:"GameType"`
	BetLiveStatus    string      `json:"bet_live_status" db:"Bet_Live_Status"`
	MatchID          int         `json:"match_id" db:"Match_ID"`
	ParlayGametype   int         `json:"parlay_game_type" db:"Parlay_GameType"`
	SportName        *string     `json:"sport_name" db:"Sport_Name"`
	LeagueName       *string     `json:"league_name" db:"League_Name"`
	HomeName         string      `json:"home_name" db:"Home_Name"`
	AwayName         string      `json:"away_name" db:"Away_Name"`
	BetChoice        string      `json:"bet_choice" db:"Bet_Choice"`
	Handicap         float64     `json:"handicap" db:"Handicap"`
	Odds             float64     `json:"odds" db:"Odds"`
	BetNeutralStatus *string     `json:"bet_neutral_status" db:"Bet_Neutral_Status"`
	BetFavStatus     int         `json:"bet_fav_status" db:"Bet_Fav_Status"`
	BetScoreHome     int         `json:"bet_score_home" db:"Bet_Score_Home"`
	BetScoreAway     int         `json:"bet_score_away" db:"Bet_Score_Away"`
	HTScoreStatus    *string     `json:"ht_score_status" db:"HT_Score_Status"`
	FTScoreStatus    *string     `json:"ft_score_status" db:"FT_Score_Status"`
	HTHome           *string     `json:"ht_home" db:"HT_Home"`
	HTAway           *string     `json:"ht_away" db:"HT_Away"`
	FSHome           *string     `json:"fs_home" db:"FS_Home"`
	FSAway           *string     `json:"fs_away" db:"FS_Away"`
	BetCommision     int         `json:"bet_commision" db:"Bet_Commision"`
	Currency         string      `json:"currency" db:"Currency"`
	BetAmount        float64     `json:"bet_amount" db:"Bet_Amount"`
	BetAmountRMB     float64     `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	WinlossStatus    string      `json:"winloss_status" db:"WinLoss_Status"`
	WinlossAmount    float64     `json:"winloss_amount" db:"WinLoss_Amount"`
	WinlossAmountRMB float64     `json:"winloss_amount_rmb" db:"WinLoss_Amount_RMB"`
	CompanyStockRMB  float64     `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	IP               string      `json:"ip" db:"IP"`
	Folds            int         `json:"folds" db:"Folds"`
	Tickets          int         `json:"tickets" db:"Tickets"`
	BetBuilderMarket string      `json:"bet_builder_market" db:"BetBuilderMarket"`
	GameTypeNameBTI  null.String `json:"game_type_name_bti" db:"GameTypeName_BTI"`
	ChoiceNameBTI    null.String `json:"choice_name_bti" db:"ChoiceName_BTI"`
}

type GrandTotalBetDetail struct {
	BetAmount        *float64 `json:"bet_amount" db:"Bet_Amount"`
	BetAmountRMB     *float64 `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	WinlossAmount    *float64 `json:"winloss_amount" db:"WinLoss_Amount"`
	WinlossAmountRMB *float64 `json:"winloss_amount_rmb" db:"WinLoss_Amount_RMB"`
	CompanyStockRMB  *float64 `json:"company_stock_rmb" db:"Company_Stock_RMB"`
}
