package model

type FundTransfer struct {
	No_Customer   int     `json:"no_customer" db:"No_Customer"`
	USER_LOGIN    string  `json:"user_login" db:"USER_LOGIN"`
	Currency      string  `json:"currency" db:"Currency"`
	Deposit       float64 `json:"deposit" db:"Deposit"`
	Withdrawal    float64 `json:"withdrawal" db:"Withdrawal"`
	Balance       float64 `json:"balance" db:"Balance"`
	DepositRMB    float64 `json:"deposit_rmb" db:"DepositRMB"`
	WithdrawalRMB float64 `json:"withdrawal_rmb" db:"WithdrawalRMB"`
	BalanceRMB    float64 `json:"balance_rmb" db:"BalanceRMB"`
}

type FundTransferSummary struct {
	DepositRMB    float64 `json:"deposit_rmb" db:"DepositRMB"`
	WithdrawalRMB float64 `json:"withdrawal_rmb" db:"WithdrawalRMB"`
	BalanceRMB    float64 `json:"balance_rmb" db:"BalanceRMB"`
}

type FundTransferDetail struct {
	Tran_Date      string  `json:"tran_date" db:"Tran_Date"`
	Fund_Type      int     `json:"fund_type" db:"Fund_Type"`
	Fund_Type_Desc string  `json:"fund_type_desc" db:"Fund_Type_Desc"`
	Currency       string  `json:"currency" db:"Currency"`
	Amount         float64 `json:"amount" db:"Amount"`
	Start_Balance  float64 `json:"start_balance" db:"Start_Balance"`
	End_Balance    float64 `json:"end_balance" db:"End_Balance"`
	Status         int     `json:"status" db:"Status"`
	Status_Desc    string  `json:"status_desc" db:"Status_Desc"`
}
