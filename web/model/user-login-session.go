package model

type ListUserLoginSession struct {
	UserLoginID int    `json:"user_login_id" db:"User_Login_ID"`
	DateSignOn  string `json:"date_sign_on" db:"Date_Sign_On"`
	Username    string `json:"username" db:"Username"`
	IPLogin     string `json:"ip_login" db:"IP_Login"`
	SessionID   string `json:"session_id" db:"Session_ID"`
}

type ListUserLoginSessionPopUp struct {
	DateSignOn string `json:"date_sign_on" db:"Date_Sign_On"`
	DTSignOff  string `json:"dt_sign_off" db:"Date_Sign_Off"`
	IPLogin    string `json:"ip_login" db:"IP_Login"`
	DTSignOn   string `json:"dt_sign_on" db:"DT_Sign_On"`
}
