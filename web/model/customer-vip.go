package model

type CustomerVIP struct {
	Customer_ID    int     `json:"customer_id" db:"Customer_ID"`
	Customer_Level string  `json:"customer_level" db:"Customer_Level"`
	User_Name      string  `json:"user_name" db:"User_Name"`
	Branch_Name    string  `json:"branch_name" db:"Branch_Name"`
	VIP_Code       int     `json:"vip_code" db:"VIP_Code"`
	VIP_Value      float64 `json:"vip_value" db:"VIP_Value"`
	VIP_Value2     float64 `json:"vip_value2" db:"VIP_Value2"`
	Stamp_Date     string  `json:"stamp_date" db:"Stamp_Date"`
	Stamp_User     string  `json:"stamp_user" db:"Stamp_User"`
	Index_Number   int     `json:"index_number" db:"Index_Number"`
	IsShowValue1   string  `json:"is_show_value1" db:"IsShowValue1"`
	IsShowValue2   string  `json:"is_show_value2" db:"IsShowValue2"`
	// SportID     int64  `json:"sport_id"`
	// CustomerVIP string `json:"league_group"`
}

type CustomerVIPSummary struct {
	VIPCode        int    `json:"vip_code" db:"VIPCode"`
	VIPDescription string `json:"vip_description" db:"VIPDescription"`
	TotalCust      int    `json:"total_cust" db:"TotalCust"`
}

type CustomerVIPCompliance struct {
	Customer_ID    int     `json:"customer_id" db:"Customer_ID"`
	Customer_Level string  `json:"customer_level" db:"Customer_Level"`
	User_Name      string  `json:"user_name" db:"User_Name"`
	Branch_Name    string  `json:"branch_name" db:"Branch_Name"`
	VIP_Code       int     `json:"vip_code" db:"VIP_Code"`
	VIP_Value      float64 `json:"vip_value" db:"VIP_Value"`
	VIP_Value2     float64 `json:"vip_value2" db:"VIP_Value2"`
	Stamp_Date     string  `json:"stamp_date" db:"Stamp_Date"`
	Stamp_User     string  `json:"stamp_user" db:"Stamp_User"`
	Index_Number   int     `json:"index_number" db:"Index_Number"`
	IsShowValue1   string  `json:"is_show_value1" db:"IsShowValue1"`
	IsShowValue2   string  `json:"is_show_value2" db:"IsShowValue2"`
	Status         int     `json:"status" db:"Status"`
}
