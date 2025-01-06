package model

type OperatorSeamless struct {
	BranchID     string `json:"branch_id" db:"Branch_ID"`
	BranchName   string `json:"branch_name" db:"Branch_Name"`
	Prefix       string `json:"prefix" db:"prefix"`
	OperatorID   string `json:"operator_id" db:"Operator_ID"`
	UserName     string `json:"user_name" db:"User_Name"`
	AppID        string `json:"app_id" db:"App_ID"`
	ValidateURL  string `json:"validate_url" db:"Validate_URL"`
	HostID       int    `json:"host_id" db:"HostID"`
	SiteCode     string `json:"site_code" db:"SiteCode"`
	SecretKey    string `json:"secret_key" db:"SecretKey"`
	STActive     string `json:"st_active" db:"ST_Active"`
	OperatorName string `json:"operator_name" db:"OperatorName"`
}

type OperatorConfig struct {
	OperatorID     string `json:"operator_id"`
	ConfigKey      string `json:"config_key" db:"ConfigKey"`
	ConfigValue    string `json:"config_value" db:"ConfigValue"`
	HttpTimeout    int    `json:"http_timeout"`
	RequestTimeout int    `json:"request_timeout"`
}

type OperatorCurrency struct {
	Currency string `json:"currency" db:"Currency"`
	Flag     bool   `json:"flag" db:"Flag"`
}
