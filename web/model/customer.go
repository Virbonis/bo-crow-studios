package model

import "github.com/guregu/null"

type CustomerList struct {
	CustomerID              string      `json:"customer_id" db:"Customer_ID"`
	CustomerType            string      `json:"customer_type" db:"Customer_Type"`
	CustomerLevel           string      `json:"customer_level" db:"Customer_Level"`
	BranchName              string      `json:"branch_name" db:"Branch_Name"`
	Username                string      `json:"username" db:"Username"`
	Currency                string      `json:"currency" db:"Currency"`
	CashBalance             float64     `json:"cash_balance" db:"Cash_Balance"`
	JoinDate                string      `json:"join_date" db:"Join_Date"`
	CustomerActiveStatus    int         `json:"customer_active_status" db:"Customer_Active_Status"`
	SmartPunterLevel        int         `json:"smart_punter_level" db:"Smart_Punter_Level"`
	IsHasDownline           int         `json:"is_has_downline" db:"Is_Has_Downline"`
	IsCashMember            string      `json:"is_cash_member" db:"Is_Cash_Member"`
	CustomerTreeGetDownline string      `json:"customer_tree_get_downline" db:"Customer_Tree_Get_Downline"`
	AliasName               null.String `json:"alias_name" db:"AliasName"`
	LimitProfileID          null.String `json:"limit_profile_id" db:"Limit_Profile_ID"`
}

type CustomerBetLimitLog struct {
	StampUser string `json:"stamp_user" db:"Stamp_User"`
	StampDate string `json:"stamp_date" db:"Stamp_Date"`
	OldValue  string `json:"old_value" db:"OldValue"`
	NewValue  string `json:"new_value" db:"NewValue"`
}

type CustomerVIPLog struct {
	VIPCode       string `json:"vip_code" db:"VIPCode"`
	DefaultValue  string `json:"default_value" db:"DefaultValue"`
	DefaultValue2 string `json:"default_value2" db:"DefaultValue2"`
	Status        string `json:"status" db:"Status"`
	StampDate     string `json:"stamp_date" db:"StampDate"`
	StampUser     string `json:"stamp_user" db:"StampUser"`
}

type UplineCustomer struct {
	CustomerID   string `json:"customer_id" db:"Customer_ID"`
	CustomerTree string `json:"customer_tree" db:"Customer_Tree"`
	Username     string `json:"username" db:"Username"`
}

type EditCustomerMain struct {
	CustomerID             string      `json:"customer_id" db:"Customer_ID"`
	Username               string      `json:"username" db:"Username"`
	AliasName              null.String `json:"alias_name" db:"AliasName"`
	Currency               string      `json:"currency" db:"Currency"`
	IsCustomerHasDownline  int         `json:"is_customer_has_downline" db:"Is_Customer_Has_Downline"`
	CustomerType           string      `json:"customer_type" db:"Customer_Type"`
	CustomerLevel          string      `json:"customer_level" db:"Customer_Level"`
	CustomerSuspend_Status int         `json:"customer_suspend_status" db:"Customer_Suspend_Status"`
	CustomerActive_Status  int         `json:"customer_active_status" db:"Customer_Active_Status"`
	CustomerBetLimitFactor float64     `json:"customer_bet_limit_factor" db:"Customer_Bet_Limit_Factor"`
	CashCategoryID         string      `json:"cash_category_id" db:"Cash_Category_ID"`
	SmartPunterLevel       int         `json:"smart_punter_level" db:"Smart_Punter_Level"`
	OddsGroup              int         `json:"odds_group" db:"Odds_Group"`
	MinBet                 float64     `json:"min_bet" db:"Min_Bet"`
	MaxBet                 float64     `json:"max_bet" db:"Max_Bet"`
	MatchLimit             float64     `json:"match_limit" db:"Match_Limit"`
	CreditLimit            float64     `json:"credit_limit" db:"Credit_Limit"`
	UsedCreditLimit        float64     `json:"used_credit_limit" db:"Used_Credit_Limit"`
}
type EditCustomerVIP struct {
	VIPCode        string  `json:"vip_code" db:"VipCode"`
	VIPDescription string  `json:"vip_description" db:"VIPDescription"`
	OnVIP          string  `json:"on_vip" db:"onVIP"`
	Value1         float64 `json:"value1" db:"Value1"`
	IsShowValue    string  `json:"is_show_value" db:"isShowValue"`
	Value2         float64 `json:"value2" db:"Value2"`
	IsShowValue2   string  `json:"is_show_value2" db:"isShowValue2"`
}
type EditCustomerUpline struct {
	CustomerID    string  `json:"customer_id" db:"Customer_ID"`
	Username      string  `json:"username" db:"Username"`
	CustomerLevel string  `json:"customer_level" db:"Customer_Level"`
	VIPCode       string  `json:"vip_code" db:"VipCode"`
	Value1        float64 `json:"value1" db:"Value1"`
	Value2        float64 `json:"value2" db:"Value2"`
}

type CustomerLimitProfile struct {
	ProfileID string `json:"profile_id" db:"ProfileID"`
}

type EditCustomerBetLimit struct {
	CustomerID          string  `json:"customer_id" db:"Customer_ID"`
	Username            string  `json:"username" db:"Username"`
	Currency            string  `json:"currency" db:"Currency"`
	BranchID            string  `json:"branch_id" db:"Branch_ID"`
	CommissionAHOUOEPct float64 `json:"commission_ahouoe_pct" db:"Commission_AHOUOE_Pct"`
	CommissionOtherPct  float64 `json:"commission_other_pct" db:"Commission_Other_Pct"`
	LimitProfile        string  `json:"limit_profile" db:"Limit_Profile"`
	CompType            string  `json:"comp_type" db:"CompType"`
	Rank                int     `json:"rank" db:"Rank"`
}
type EditCustomerBetLimitBySport struct {
	SportID     int         `json:"sport_id" db:"No_Sport"`
	Sport_Name  null.String `json:"sport_name" db:"Sport_Name"`
	Min_AH      float64     `json:"min_ah" db:"Min_AH"`
	Max_AH      float64     `json:"max_ah" db:"Max_AH"`
	Limit_AH    float64     `json:"limit_ah" db:"Limit_AH"`
	Min_FHAH    float64     `json:"min_fhah" db:"Min_FHAH"`
	Max_FHAH    float64     `json:"max_fhah" db:"Max_FHAH"`
	Limit_FHAH  float64     `json:"limit_fhah" db:"Limit_FHAH"`
	Min_OU      float64     `json:"min_ou" db:"Min_OU"`
	Max_OU      float64     `json:"max_ou" db:"Max_OU"`
	Limit_OU    float64     `json:"limit_ou" db:"Limit_OU"`
	Min_FHOU    float64     `json:"min_fhou" db:"Min_FHOU"`
	Max_FHOU    float64     `json:"max_fhou" db:"Max_FHOU"`
	Limit_FHOU  float64     `json:"limit_fhou" db:"Limit_FHOU"`
	Min_OE      float64     `json:"min_oe" db:"Min_OE"`
	Max_OE      float64     `json:"max_oe" db:"Max_OE"`
	Limit_OE    float64     `json:"limit_oe" db:"Limit_OE"`
	Min_FHOE    float64     `json:"min_fhoe" db:"Min_FHOE"`
	Max_FHOE    float64     `json:"max_fhoe" db:"Max_FHOE"`
	Limit_FHOE  float64     `json:"limit_fhoe" db:"Limit_FHOE"`
	Min_ML      float64     `json:"min_ml" db:"Min_ML"`
	Max_ML      float64     `json:"max_ml" db:"Max_ML"`
	Limit_ML    float64     `json:"limit_ml" db:"Limit_ML"`
	Min_1X2     float64     `json:"min_1x2" db:"Min_1X2"`
	Max_1X2     float64     `json:"max_1x2" db:"Max_1X2"`
	Limit_1X2   float64     `json:"limit_1x2" db:"Limit_1X2"`
	Min_FH1X2   float64     `json:"min_fh1x2" db:"Min_FH1X2"`
	Max_FH1X2   float64     `json:"max_fh1x2" db:"Max_FH1X2"`
	Limit_FH1X2 float64     `json:"limit_fh1x2" db:"Limit_FH1X2"`
	Min_DC      float64     `json:"min_dc" db:"Min_DC"`
	Max_DC      float64     `json:"max_dc" db:"Max_DC"`
	Limit_DC    float64     `json:"limit_dc" db:"Limit_DC"`
	Min_TG      float64     `json:"min_tg" db:"Min_TG"`
	Max_TG      float64     `json:"max_tg" db:"Max_TG"`
	Limit_TG    float64     `json:"limit_tg" db:"Limit_TG"`
	Min_FGLG    float64     `json:"min_fglg" db:"Min_FGLG"`
	Max_FGLG    float64     `json:"max_fglg" db:"Max_FGLG"`
	Limit_FGLG  float64     `json:"limit_fglg" db:"Limit_FGLG"`
	Min_HTFT    float64     `json:"min_htft" db:"Min_HTFT"`
	Max_HTFT    float64     `json:"max_htft" db:"Max_HTFT"`
	Limit_HTFT  float64     `json:"limit_htft" db:"Limit_HTFT"`
	Min_CS      float64     `json:"min_cs" db:"Min_CS"`
	Max_CS      float64     `json:"max_cs" db:"Max_CS"`
	Limit_CS    float64     `json:"limit_cs" db:"Limit_CS"`
	Min_FHCS    float64     `json:"min_fhcs" db:"Min_FHCS"`
	Max_FHCS    float64     `json:"max_fhcs" db:"Max_FHCS"`
	Limit_FHCS  float64     `json:"limit_fhcs" db:"Limit_FHCS"`
	Min_ORGT    float64     `json:"min_orgt" db:"Min_ORGT"`
	Max_ORGT    float64     `json:"max_orgt" db:"Max_ORGT"`
	Limit_ORGT  float64     `json:"limit_orgt" db:"Limit_ORGT"`
	Min_PRLY    float64     `json:"min_prly" db:"Min_PRLY"`
	Max_PRLY    float64     `json:"max_prly" db:"Max_PRLY"`
	Limit_PRL   float64     `json:"limit_prl" db:"Limit_PRLY"`
}

type CustomerDelayBet struct {
	NoSport    int    `json:"sport_id" db:"No_Sport"`
	EarlyDelay int    `json:"early_delay" db:"EarlyDelay"`
	TodayDelay int    `json:"today_delay" db:"TodayDelay"`
	LiveDelay  int    `json:"live_delay" db:"LiveDelay"`
	StampDate  string `json:"stamp_date" db:"StampDate"`
}
