package logger

import (
	"encoding/xml"
)

type LogXML struct {
	XMLName    xml.Name      `xml:"log" json:"-"`
	Parameters XMLParameters `xml:"parameters" json:"parameters"`
	Audits     XMLAudits     `xml:"audits" json:"audits"`
	Records    XMLRecords    `xml:"records" json:"records"`
}
type XMLParameters struct {
	Parameters []XMLParameter `xml:"parameter" json:"parameter"`
}
type XMLParameter struct {
	Name  string `xml:"name,attr" json:"name"`
	Value string `xml:",chardata" json:"value"`
}
type XMLAudits struct {
	Audits []XMLAudit `xml:"audit" json:"audit"`
}
type XMLAudit struct {
	TableName string `xml:",attr" json:"table_name"`
	FieldName string `xml:",attr" json:"field_name"`
	FieldDesc string `xml:",attr" json:"field_desc"`
	OldValue  string `xml:",attr" json:"old_value"`
	NewValue  string `xml:",attr" json:"new_value"`
	IsChanged string `xml:",attr" json:"is_changed"`
}
type XMLRecords struct {
	Records []XMLRecord `xml:"record" json:"record"`
}
type XMLRecord struct {
	Severity   int    `xml:"severity,attr" json:"severity"`
	Date       string `xml:"date,attr" json:"date"`
	Text       string `xml:"text" json:"text"`
	StackTrace string `xml:"stackTrace" json:"-"`
}
