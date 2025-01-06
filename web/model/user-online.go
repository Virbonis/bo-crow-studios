package model

type UserOnline struct {
	BranchCode   string `json:"branch_code" db:"Branch_Code"`
	BranchName   string `json:"branch_name" db:"Branch_Name"`
	Alias        string `json:"alias" db:"Alias"`
	UserOnline   int    `json:"user_online" db:"User_Online"`
	Mobile       int    `json:"mobile" db:"Mobile"`
	WAP          int    `json:"wap" db:"WAP"`
	WEB          int    `json:"web" db:"WEB"`
	MobilePlus   int    `json:"mobile_plus" db:"Mobile++"`
	Simple       int    `json:"simple" db:"Simple"`
	ChinaDesktop int    `json:"china_desktop" db:"ChinaDesktop"`
	ChinaMobile  int    `json:"china_mobile" db:"ChinaMobile"`
}
