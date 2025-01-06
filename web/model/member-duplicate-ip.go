package model

type MemberDuplicateIP struct {
	IPAddress   string `json:"ip_address" db:"IP_Address"`
	UserID      string `json:"user_id" db:"User_ID"`
	CustomerID  int    `json:"customer_id" db:"Customer_ID"`
	BetCount    int    `json:"bet_count" db:"BetCount"`
	LoginCount  int    `json:"login_count" db:"LoginCount"`
	IndexNumber int    `json:"index_number" db:"Index_Number"`
	Currency    string `json:"currency" db:"Currency"`
}
