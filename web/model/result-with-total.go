package model

type ResultWithTotal struct {
	Total  int         `json:"total"`
	Result interface{} `json:"result"`
}
