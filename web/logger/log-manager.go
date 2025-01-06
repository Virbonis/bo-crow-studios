package logger

import (
	"database/sql"
	"encoding/xml"
	"fmt"
	"reflect"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/util"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	log "github.com/sirupsen/logrus"
)

const sourceName = "tsubasa-admin"

type LogManager struct {
	taskID     string
	taskName   string
	itemName   string
	userName   string
	startDate  time.Time
	finishDate time.Time
	source     string
	severity   int

	Parameters   []interface{} // list of sp parameters
	auditObjects []AuditObject // list of prepared audit tables
	auditRecords []AuditRecord // list of updated fields
	logRecords   []LogRecords  // list of written log status or message

	executionLog string
	matchID      string // used to differentiate spName
}
type AuditObject struct {
	sqlConn   *sqlx.DB
	tableName string
	pkValue   interface{}
}
type AuditRecord struct {
	tableName string
	fieldName string
	fieldDesc string
	oldValue  interface{}
	newValue  interface{}
	isChanged bool
	isFinish  bool
}
type LogRecords struct {
	severity int
	date     time.Time
	text     string
}

func (logManager *LogManager) StartTask(taskName, itemName, stampUser string) {
	logManager.startDate = time.Now()
	logManager.source = sourceName
	logManager.taskID = uuid.New().String()
	logManager.taskName = fmt.Sprintf("%v - %v", strings.ToUpper(itemName), taskName)
	logManager.itemName = strings.ToUpper(itemName)
	logManager.userName = stampUser
}

func (logManager *LogManager) WriteParameters(args ...interface{}) {
	logManager.Parameters = args
}

func (logManager *LogManager) PrepareAudit(sqlConn *sqlx.DB, tableName string, pkValue interface{}, auditFields []string) {
	logManager.auditObjects = append(logManager.auditObjects, AuditObject{
		sqlConn:   sqlConn,
		tableName: tableName,
		pkValue:   pkValue,
	})
	// get columns from table append to auditrecords
	rows, err := sqlConn.Query("MGMT_LIST_LOG_TABLE_COLUMNS",
		sql.Named("table_name", tableName),
	)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return
	}
	for rows.Next() {
		var tableID, columnID, columnName, columnDesc string
		var isPK bool
		err := rows.Scan(&tableID, &columnID, &columnName, &columnDesc, &isPK)
		if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return
		}
		if isPK || util.Contains(auditFields, columnName) {
			logManager.auditRecords = append(logManager.auditRecords, AuditRecord{
				tableName: tableName,
				fieldName: columnName,
				fieldDesc: columnDesc,
			})
		}
	}

	// get data from table to set oldvalue of auditrecords
	temp := make(map[string]interface{})
	err = sqlConn.QueryRowx("MGMT_LIST_LOG_TABLE_COLUMNSVALUE",
		sql.Named("table_name", tableName),
		sql.Named("pk_values", pkValue),
	).MapScan(temp)
	util.MapBytesToString(temp)
	if err != nil {
		log.Warnf("[mssql] Failed executing stored procedure: %v", err)
		return
	}
	for i, auditRecord := range logManager.auditRecords {
		if auditRecord.tableName == tableName {
			if oldValue, ok := temp[auditRecord.fieldName]; ok {
				auditRecord.oldValue = oldValue
			}
		}
		logManager.auditRecords[i] = auditRecord
	}
}
func (logManager *LogManager) FinishAudit() {
	// do not finish audit if error
	if logManager.severity == 2 {
		return
	}
	for _, auditObject := range logManager.auditObjects {
		// get data from table to set newvalue of auditrecords
		temp := make(map[string]interface{})
		err := auditObject.sqlConn.QueryRowx("MGMT_LIST_LOG_TABLE_COLUMNSVALUE",
			sql.Named("table_name", auditObject.tableName),
			sql.Named("pk_values", auditObject.pkValue),
		).MapScan(temp)
		util.MapBytesToString(temp)
		// if no rows found, finish newvalue with empty string
		if err == sql.ErrNoRows {
			for i, auditRecord := range logManager.auditRecords {
				if auditRecord.tableName == auditObject.tableName {
					auditRecord.newValue = ""
					auditRecord.isChanged = true
					auditRecord.isFinish = true
				}
				logManager.auditRecords[i] = auditRecord
			}
			return
		} else if err != nil {
			log.Warnf("[mssql] Failed scanning row: %v", err)
			return
		}
		for i, auditRecord := range logManager.auditRecords {
			if auditRecord.tableName == auditObject.tableName {
				if newValue, ok := temp[auditRecord.fieldName]; ok {
					auditRecord.newValue = newValue
					auditRecord.isChanged = auditRecord.oldValue != auditRecord.newValue
					auditRecord.isFinish = true
				}
			}
			logManager.auditRecords[i] = auditRecord
		}
	}
}

// guidance for manual logging WriteStatus
// {action} = Insert/Update/Delete
// {entity} = Application/Menu/etc
// {methodName} = funcName
// if retVal == -1
// 	WriteStatus("Unable {action} {entity} ({methodName}) already exist")
// else
// 	WriteStatus("Success {action} "{entity}" ("{methodName}") [all:"{stopWatchVal}" ms, sp:"{spStopWatchVal}" ms]")
func (logManager *LogManager) WriteStatus(message string) {
	logManager.severity = 0
	logManager.WriteLogRecord(0, message)
}
func (logManager *LogManager) WriteStatusError(message string) {
	logManager.severity = 2
	logManager.WriteLogRecord(2, message)
}
func (logManager *LogManager) WriteLogRecord(severity int, text string) {
	logManager.logRecords = append(logManager.logRecords, LogRecords{
		date:     time.Now(),
		severity: severity,
		text:     text,
		// textIdent:           0,
		// exceptionStackTrace: stackTrace,
		// innerTaskStart: false,
		// textParameters:      []string{},
	})
}

func (logManager *LogManager) SetMatchIDorCustName(matchID interface{}) {
	logManager.matchID = fmt.Sprint(matchID)
}
func (logManager *LogManager) FormatExecutionLog() {
	logXML := LogXML{}
	XMLParameters := &logXML.Parameters
	for _, param := range logManager.Parameters {
		if p, ok := param.(sql.NamedArg); ok {
			// skip parameter sql.Out
			if reflect.TypeOf(p.Value).String() != "sql.Out" {
				XMLParameters.Parameters = append(XMLParameters.Parameters, XMLParameter{
					Name:  p.Name,
					Value: fmt.Sprint(p.Value),
				})
			}
		}
	}
	XMLAudits := &logXML.Audits
	for _, audit := range logManager.auditRecords {
		if audit.isFinish {
			XMLAudits.Audits = append(XMLAudits.Audits, XMLAudit{
				TableName: audit.tableName,
				FieldName: audit.fieldName,
				OldValue:  fmt.Sprint(audit.oldValue),
				NewValue:  fmt.Sprint(audit.newValue),
				IsChanged: util.BTS(audit.isChanged),
			})
		}
	}
	XMLRecords := &logXML.Records
	for _, record := range logManager.logRecords {
		XMLRecords.Records = append(XMLRecords.Records, XMLRecord{
			Date:     fmt.Sprint(record.date.Format("2006-01-02 15:04:05")),
			Severity: record.severity,
			Text:     record.text,
		})
	}
	b, err := xml.Marshal(logXML)
	if err != nil {
		log.Warnf("Failed marshaling xml: %v", err)
	}
	logManager.executionLog = string(b)
}
func (logManager *LogManager) EndTask() {
	// no logging for taskName List or Get
	if logManager.severity == 0 && (strings.Contains(logManager.taskName, "List") || strings.Contains(logManager.taskName, "Get")) {
		return
	}

	logManager.FinishAudit()
	logManager.FormatExecutionLog()
	logManager.finishDate = time.Now()
	if logManager.matchID == "0" || logManager.matchID == "" {
		_, err := sqlConnections.Exec("AuditLogInsert",
			sql.Named("RecordID", logManager.taskID),
			sql.Named("UserID", 0),
			sql.Named("ItemID", 0),
			sql.Named("Username", logManager.userName),
			sql.Named("SeverityID", logManager.severity),
			sql.Named("StartDate", logManager.startDate),
			sql.Named("FinishDate", logManager.finishDate),
			sql.Named("SourceName", logManager.source),
			sql.Named("TaskName", logManager.taskName),
			sql.Named("ItemName", logManager.itemName),
			sql.Named("ExecutionLog", logManager.executionLog),
		)
		if err != nil {
			log.Warnf("[mssql] Failed executing stored procedure AuditLogInsert: %v", err)
			return
		}
	} else {
		_, err := sqlConnections.Exec("AuditLogInsert2",
			sql.Named("RecordID", logManager.taskID),
			sql.Named("UserID", 0),
			sql.Named("ItemID", 0),
			sql.Named("Username", logManager.userName),
			sql.Named("SeverityID", logManager.severity),
			sql.Named("StartDate", logManager.startDate),
			sql.Named("FinishDate", logManager.finishDate),
			sql.Named("SourceName", logManager.source),
			sql.Named("TaskName", logManager.taskName),
			sql.Named("ItemName", logManager.itemName),
			sql.Named("ExecutionLog", logManager.executionLog),
			sql.Named("MatchID", logManager.matchID),
		)
		if err != nil {
			log.Warnf("[mssql] Failed executing stored procedure AuditLogInsert2: %v", err)
			return
		}
	}
}
