package model

type Sport struct {
	SportID       int    `json:"sport_id" db:"Sport_ID"`
	Name          string `json:"name" db:"Sport_Name"`
	SportNameEnUS string `json:"sport_name_en" db:"Sport_Name_EnUS"`
	SportNameZhCN string `json:"sport_name_cn" db:"Sport_Name_ZhCN"`
	SportNameThTH string `json:"sport_name_th" db:"Sport_Name_ThTH"`
	SportNameJaJP string `json:"sport_name_jp" db:"Sport_Name_JaJP"`
	SportNameKoKR string `json:"sport_name_kr" db:"Sport_Name_KoKR"`
	SportNameViVN string `json:"sport_name_vn" db:"Sport_Name_ViVN"`
	SportNameIdID string `json:"sport_name_id" db:"Sport_Name_IdID"`
	SiteNoDisplay int    `json:"site_no_display" db:"Site_NoDisplay"`
}

type SportSorting struct {
	SportID   int64  `json:"sport_id" db:"No_Sport"`
	SportName string `json:"sport_name" db:"Nama_Sport"`
	NoDisplay int32  `json:"no_display" db:"Site_NoDisplay"`
}

type SportSelect struct {
	SportID int    `json:"sport_id" db:"Sport_ID"`
	Name    string `json:"name" db:"Sport_Name"`
}

type SportDelayBet struct {
	NoCustomer int    `json:"customer_id" db:"No_Customer"`
	BranchName string `json:"branch_name" db:"Branch_Name"`
	UserName   string `json:"user_name" db:"Username"`
	Currency   string `json:"currency" db:"Currency"`
	EarlyDelay string `json:"early_delay" db:"EarlyDelay"`
	TodayDelay string `json:"today_delay" db:"TodayDelay"`
	LiveDelay  string `json:"live_delay" db:"LiveDelay"`
	StampDate  string `json:"stamp_date" db:"stampDate"`
}
