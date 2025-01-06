package model

type Team struct {
	TeamId       int    `json:"team_id" db:"Team_ID"`
	TeamNameEnUS string `json:"team_name_en" db:"Team_Name_EnUS"`
	TeamNameZhCN string `json:"team_name_cn" db:"Team_Name_ZhCN"`
	TeamNameZhTW string `json:"team_name_tw" db:"Team_Name_ZhTW"`
	TeamNameThTH string `json:"team_name_th" db:"Team_Name_ThTH"`
	TeamNameJaJP string `json:"team_name_jp" db:"Team_Name_JaJP"`
	TeamNameKoKR string `json:"team_name_kr" db:"Team_Name_KoKR"`
	TeamNameViVN string `json:"team_name_vn" db:"Team_Name_ViVN"`
	TeamNameIdID string `json:"team_name_id" db:"Team_Name_IdID"`
	Active       string `json:"active" db:"Active"`
	ShortName    string `json:"short_name" db:"Short_Name"`
	SportID      string `json:"sport_id" db:"Sport_ID"`
}

type DetailTeam struct {
	Country string `json:"country" db:"Country"`
}

type TeamSelect struct {
	NoTeam   int    `json:"team_id" db:"No_Team"`
	TeamName string `json:"team_name" db:"Nama_TeamEN"`
}
type TeamMappingTeam struct {
	No_Team     int    `json:"no_team" db:"No_Team"`
	Nama_TeamEN string `json:"nama_team_en" db:"Nama_TeamEN"`
	Our_Team    string `json:"our_team" db:"Our_Team"`
}

type TeamMappingTeamRB struct {
	NoTeam     int    `json:"no_team" db:"No_Team"`
	NamaTeamEN string `json:"nama_team_en" db:"Nama_TeamEN"`
	OurTeam    string `json:"our_team" db:"Our_Team"`
}
