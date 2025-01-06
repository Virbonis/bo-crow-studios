package model

type FavUnderdogPercentageList struct {
	BranchCode           string  `json:"branch_code" db:"BranchCode"`
	BranchName           string  `json:"branch_name" db:"BranchName"`
	Currency             string  `json:"currency" db:"Currency"`
	DeadBall_Fav         float64 `json:"dead_ball_fav" db:"DeadBall_Fav"`
	DeadBall_Underdog    float64 `json:"dead_ball_underdog" db:"DeadBall_UnderDog"`
	DeadBall_Over        float64 `json:"dead_ball_over" db:"DeadBall_Over"`
	DeadBall_Under       float64 `json:"dead_ball_under" db:"DeadBall_Under"`
	RunningBall_Fav      float64 `json:"running_ball_fav" db:"RunningBall_Fav"`
	RunningBall_Underdog float64 `json:"running_ball_underdog" db:"RunningBall_UnderDog"`
	RunningBall_Over     float64 `json:"running_ball_over" db:"RunningBall_Over"`
	RunningBall_Under    float64 `json:"running_ball_under" db:"RunningBall_Under"`
}
