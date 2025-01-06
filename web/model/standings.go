package model

type StandingCategory struct {
	StandingsCategory string `json:"standings_category" db:"StandingsCategory"`
	RedisCategory     string `json:"redis_category" db:"RedisCategory"`
}
type Standings struct {
	RowID      int    `json:"row_id" db:"RowID"`
	Category   string `json:"category" db:"StandingsCategory"`
	GroupName  string `json:"group_name" db:"GroupName"`
	NoTeam     int    `json:"no_team" db:"No_Team"`
	Play       int    `json:"play" db:"Play"`
	Win        int    `json:"win" db:"Win"`
	Draw       int    `json:"draw" db:"Draw"`
	Lose       int    `json:"lose" db:"Lose"`
	Goal       int    `json:"goal" db:"Goal"`
	Conceded   int    `json:"conceded" db:"Conceded"`
	Points     int    `json:"points" db:"Points"`
	SortNumber int    `json:"sort_number" db:"SortNumber"`
	NameTeamEN string `json:"name_team_en" db:"Nama_TeamEN"`
}
