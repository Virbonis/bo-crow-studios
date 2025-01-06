package model

import (
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/logger"
)

type AuditLog struct {
	RecordID           string        `json:"record_id" db:"RecordID"`
	SeverityID         int           `json:"severity_id" db:"SeverityID"`
	StartDate          time.Time     `json:"start_date" db:"StartDate"`
	FinishDate         time.Time     `json:"finish_date" db:"FinishDate"`
	ItemID             int           `json:"item_id" db:"ItemID"`
	SourceName         string        `json:"source_name" db:"SourceName"`
	TaskName           string        `json:"task_name" db:"TaskName"`
	TaskDescription    string        `json:"task_description" db:"TaskDescription"`
	ItemName           string        `json:"item_name" db:"ItemName"`
	ExecutionLogString string        `json:"-" db:"ExecutionLog"`
	ExecutionLog       logger.LogXML `json:"execution_log"`
	UserID             int           `json:"user_id" db:"UserID"`
	Username           string        `json:"username" db:"Username"`
	MatchID            string        `json:"match_id" db:"MatchID"`
	RowNumber          int           `json:"row_number" db:"RowNumber"`
}

type AuditTask struct {
	SourceName      string `json:"source_name" db:"SourceName"`
	TaskName        string `json:"task_name" db:"TaskName"`
	TaskDescription string `json:"task_description" db:"TaskDescription"`
}
