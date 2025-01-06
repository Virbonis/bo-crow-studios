package model

type GridMatchLiveStream struct {
	SportID      int    `json:"sport_id" db:"SportID"`
	SportName    string `json:"sport_name" db:"SportName"`
	MatchID      int    `json:"match_id" db:"MatchID"`
	MatchDate    string `json:"match_date" db:"MatchDate"`
	League       string `json:"league" db:"League"`
	HomeTeam     string `json:"home_name" db:"HomeTeam"`
	AwayTeam     string `json:"away_name" db:"AwayTeam"`
	STLiveStream string `json:"st_live_stream" db:"ST_LiveStream"`
	LiveStreamID string `json:"live_stream_id" db:"LiveStreamID"`
	IndexNumber  int    `json:"index_number" db:"IndexNumber"`
}
