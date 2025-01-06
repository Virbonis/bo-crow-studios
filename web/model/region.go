package model

import "github.com/guregu/null"

type Region struct {
	RegionID   int    `json:"region_id" db:"RegionID"`
	RegionName string `json:"region_name" db:"Region_Name"`
}

type MasterRegion struct {
	RegionID   int         `json:"region_id" db:"Region_ID"`
	RegionEn   string      `json:"english" db:"Nama_RegionEN"`
	RegionCh   string      `json:"mandarin" db:"Nama_RegionCH"`
	RegionTw   string      `json:"taiwan" db:"Nama_RegionTW"`
	RegionTh   string      `json:"thailand" db:"Nama_RegionTH"`
	RegionJp   string      `json:"japanese" db:"Nama_RegionJP"`
	RegionKr   string      `json:"korean" db:"Nama_RegionKR"`
	RegionVn   string      `json:"vietnamese" db:"Nama_RegionVN"`
	RegionIdn  string      `json:"indonesia" db:"Nama_RegionID"`
	SortNumber int         `json:"sort_number" db:"Sort_Number"`
	FlagID     null.Int    `json:"flag_id" db:"FlagID"`
	FlagName   null.String `json:"flag_name" db:"FlagName"`
	FlagSource null.String `json:"flag_source" db:"FlagSource"`
}
