package model

import "time"

type UserInfo struct {
	UserID     int       `db:"User_Id"`
	Name       string    `db:"Name"`
	Email      string    `db:"Email"`
	Password   string    `db:"Password"`
	IsActive   bool      `db:"Is_Active"`
	LoginFail  int       `db:"Login_Fail"`
	RetryLogin int       `db:"Retry_Login"`
	LastLogin  time.Time `db:"Dt_Last_Login"`
	RoleIDs    string    `db:"RoleIDs"`
	Roles      string    `db:"Roles"`
	Avatar     string    `db:"Avatar"`
}

type UserAuth struct {
	Code         string `json:"code" db:"CODE"`
	AuthObjectID int    `json:"auth_id" db:"PermissionID"`
}

type User struct {
	UserID      int       `json:"user_id" db:"User_ID"`
	Username    string    `json:"username" db:"Username"`
	Name        string    `json:"name" db:"Name"`
	Email       string    `json:"email" db:"Email"`
	Roles       string    `json:"roles" db:"Roles"`
	LastLogin   time.Time `json:"last_login_date" db:"Last_Login"`
	IsActive    bool      `json:"is_active" db:"Is_Active"`
	IsSysAdmin  bool      `json:"is_sys_admin" db:"Is_SysAdmin"`
	IsLOB       bool      `json:"is_lob" db:"Is_LOB"`
	IsSpvTrader string    `json:"is_spv_trader" db:"Is_Spv_Trader"`
	TraderGroup string    `json:"trader_group" db:"Trader_Group"`
}

type UserSession struct {
	LoginDate  time.Time `json:"login_date" db:"DT_Sign_On"`
	LogoutDate time.Time `json:"logout_date" db:"DT_Sign_Off"`
	IPLogin    string    `json:"ip_login" db:"IP_Login"`
}
