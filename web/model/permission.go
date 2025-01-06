package model

import "github.com/guregu/null"

type Permission struct {
	PermissionID  int         `json:"permission_id" db:"PermissionID"`
	Code          string      `json:"code" db:"Code"`
	Description   string      `json:"description" db:"Description"`
	Group         string      `json:"group" db:"Group"`
	SeqNo         int         `json:"seq_no" db:"SeqNo"`
	IsForOperator bool        `json:"is_for_operator" db:"IsForOperator"`
	IsForAdmin    bool        `json:"is_for_admin" db:"IsForAdmin"`
	Roles         null.String `json:"roles" db:"Roles"`
}
