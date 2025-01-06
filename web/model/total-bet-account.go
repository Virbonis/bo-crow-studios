package model

type SummaryBetAccount struct {
	GLDate      string `json:"gl_date" db:"GL_Date"`
	TotalPlayer int    `json:"total_player" db:"TotalPlayer"`
}
