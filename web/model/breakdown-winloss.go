package model

import "github.com/guregu/null"

type BreakdownWinloss struct {
	DrillID          null.String `json:"drill_id" db:"Drill_ID"`
	Desc             null.String `json:"desc" db:"Desc"`
	BetCount         int         `json:"bet_count" db:"Bets_Count"`
	BetAmountRMB     float64     `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	CompanyStockRMB  float64     `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	MemberResultRMB  float64     `json:"member_result_rmb" db:"Member_Result_RMB"`
	CompanyResultRMB float64     `json:"company_result_rmb" db:"Company_Result_RMB"`
	MemberCount      string      `json:"member_count" db:"Member_Count"`
}

type BreakdownParlay struct {
	ParlayName       null.String `json:"parlay_name" db:"ParlayName"`
	Match            null.Int    `json:"match" db:"Match"`
	Combo            null.Int    `json:"combo" db:"Combo"`
	BetsCount        null.Int    `json:"bets_count" db:"Bets_Count"`
	MemberResultRMB  float64     `json:"member_result_rmb" db:"Member_Result_RMB"`
	CompanyResultRMB float64     `json:"company_result_rmb" db:"Company_Result_RMB"`
}

type BreakdownWinlossUTHeader struct {
	Header string `json:"header" db:"Header"`
	Link   bool   `json:"link" db:"Link"`
}

type BreakdownWinlossBetDetail struct {
	Username         string      `json:"username" db:"Username"`
	BetID            int         `json:"bet_id" db:"Bet_ID"`
	BetDate          string      `json:"bet_date" db:"Bet_Date"`
	GameType         int         `json:"game_type" db:"GameType"`
	BetLiveStatus    string      `json:"bet_live_status" db:"Bet_Live_Status"`
	MatchID          int         `json:"match_id" db:"Match_ID"`
	ParlayGameType   int         `json:"parlay_game_type" db:"Parlay_GameType"`
	SportName        null.String `json:"sport_name" db:"Sport_Name"`
	LeagueName       null.String `json:"league_name" db:"League_Name"`
	HomeName         string      `json:"home_name" db:"Home_Name"`
	AwayName         string      `json:"away_name" db:"Away_Name"`
	BetChoice        string      `json:"bet_choice" db:"Bet_Choice"`
	Handicap         float64     `json:"handicap" db:"Handicap"`
	Odds             float64     `json:"odds" db:"Odds"`
	BetNeutralStatus null.String `json:"bet_neutral_status" db:"Bet_Neutral_Status"`
	BetFavStatus     int         `json:"bet_fav_status" db:"Bet_Fav_Status"`
	BetScoreHome     int         `json:"bet_score_home" db:"Bet_Score_Home"`
	BetScoreAway     int         `json:"bet_score_away" db:"Bet_Score_Away"`
	HTScoreStatus    null.String `json:"ht_score_status" db:"HT_Score_Status"`
	FTScoreStatus    null.String `json:"ft_score_status" db:"FT_Score_Status"`
	HTHome           null.Int    `json:"ht_home" db:"HT_Home"`
	HTAway           null.Int    `json:"ht_away" db:"HT_Away"`
	FSHome           null.Int    `json:"fs_home" db:"FS_Home"`
	FSAway           null.Int    `json:"fs_away" db:"FS_Away"`
	BetCommision     int         `json:"bet_commision" db:"Bet_Commision"`
	Currency         string      `json:"currency" db:"Currency"`
	BetAmountRMB     null.Float  `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	CompanyStockRMB  null.Float  `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	MemberResultRMB  null.Float  `json:"member_result_rmb" db:"Member_Result_RMB"`
	CompanyResultRMB null.Float  `json:"company_result_rmb" db:"Company_Result_RMB"`
	WinLossStatus    string      `json:"winloss_status" db:"WinLoss_Status"`
	Folds            int         `json:"folds" db:"Folds"`
	Tickets          int         `json:"tickets" db:"Tickets"`
	BetType          string      `json:"bet_type" db:"Bet_Type"`
	BetBuilderMarket string      `json:"bet_builder_market" db:"BetBuilderMarket"`
	GameTypeNameBTI  null.String `json:"game_type_name_bti" db:"GameTypeName_BTI"`
	ChoiceNameBTI    null.String `json:"choice_name_bti" db:"ChoiceName_BTI"`
	// JackpotID        null.Int    `json:"jackpot_id" db:"JpID"`
	// LotteryID        null.Int    `json:"jackpot_id" db:"LotteryID"`
	LotteryLeagueName       string `json:"lottery_league_name" db:"LotteryLeagueName"`
	LotteryTotalMatch       string `json:"lottery_total_match" db:"LotteryTotalMatch"`
	LotteryGameType         string `json:"lottery_game_type" db:"LotteryGameType"`
	LotteryTotalCombination string `json:"lottery_total_combination" db:"LotteryTotalCombination"`
	LotteryJackpot          string `json:"lottery_jackpot" db:"LotteryJackpot"`
	LotteryJackpotType      string `json:"lottery_jackpot_type" db:"LotteryJackpotType"`
}

type BreakdownWinlossBetDetailDateExport struct {
	BreakdownWinlossBetDetail
}

type BreakdownWinlossBetDetailSummary struct {
	Bet_Amount_RMB     null.Float `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	Company_Stock_RMB  null.Float `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	Member_Result_RMB  null.Float `json:"member_result_rmb" db:"Member_Result_RMB"`
	Company_Result_RMB null.Float `json:"company_result_rmb" db:"Company_Result_RMB"`
	WinLoss_Status     string     `json:"winloss_status" db:"WinLoss_Status"`
}
