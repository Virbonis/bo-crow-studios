package model

import "github.com/guregu/null"

type MemberWinloss struct {
	Drill_ID            null.String `json:"drill_id" db:"Drill_ID"`
	Desc                null.String `json:"desc" db:"Desc"`
	Bets_Count          int         `json:"bets_count" db:"Bets_Count"`
	Win_Count           int         `json:"win_count" db:"Win_Count"`
	Win_Perc            float64     `json:"win_perc" db:"Win_Perc"`
	Draw_Count          int         `json:"draw_count" db:"Draw_Count"`
	Draw_Perc           float64     `json:"draw_perc" db:"Draw_Perc"`
	Loss_Count          int         `json:"loss_count" db:"Loss_Count"`
	Loss_Perc           float64     `json:"loss_perc" db:"Loss_Perc"`
	Bet_Amount_RMB      float64     `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	Winloss_Member_RMB  float64     `json:"winloss_member_rmb" db:"Winloss_Member_RMB"`
	Winloss_Company_RMB float64     `json:"winloss_company_rmb" db:"Winloss_Company_RMB"`
	Limit_Profile_ID    string      `json:"limit_profile_id" db:"Limit_Profile_ID"`
	Currency            string      `json:"currency" db:"Currency"`
	Join_Date           string      `json:"join_date" db:"Join_Date"`
	Total_Bets          float64     `json:"total_bets" db:"Total_Bets"`
	Total_Bet_Amount    float64     `json:"total_bet_amount" db:"Total_Bet_Amount"`
	Total_Winloss_Amt   float64     `json:"total_winloss_amt" db:"Total_Winloss_Amt"`
	Total_Winloss_Perc  float64     `json:"total_winloss_perc" db:"Total_Winloss_Perc"`
	VIPCode             null.String `json:"VIPCode" db:"VIPCode"`
}

type MemberWinlossHeader struct {
	Header string `json:"header" db:"Header"`
	Link   bool   `json:"link" db:"Link"`
}

type MemberWinlossDetail struct {
	BreakdownWinlossBetDetail
}

type MemberWinlossDetailSummary struct {
	Bet_Amount_RMB     null.Float `json:"bet_amount_rmb" db:"Bet_Amount_RMB"`
	Company_Stock_RMB  null.Float `json:"company_stock_rmb" db:"Company_Stock_RMB"`
	Member_Result_RMB  null.Float `json:"member_result_rmb" db:"Member_Result_RMB"`
	Company_Result_RMB null.Float `json:"company_result_rmb" db:"Company_Result_RMB"`
}
