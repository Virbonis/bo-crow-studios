package model

import "github.com/guregu/null"

type ListBetRequestInfo struct {
	RequestID            string      `json:"request_id" db:"RequestID"`
	RequestDate          string      `json:"request_date" db:"RequestDate"`
	UserLogin            string      `json:"user_login" db:"User_Login"`
	MemberID             string      `json:"member_id" db:"MemberID"`
	BetType              string      `json:"bet_type" db:"Bettype"`
	BetID                int         `json:"bet_id" db:"BetID"`
	TotalBetAmt          float64     `json:"total_bet_amount" db:"TotalBetAmt"`
	BetStatus            int         `json:"bet_status" db:"BetStatus"`
	BetStampDate         null.String `json:"bet_stamp_date" db:"BetStampDate"`
	BetConfirm           int         `json:"bet_confirm" db:"BetConfirm"`
	BetConfirmDate       null.String `json:"bet_confirm_date" db:"BetConfirmDate"`
	ConfirmID            string      `json:"confirm_id" db:"ConfirmID"`
	PayoutStatus         int         `json:"payout_status" db:"PayoutStatus"`
	PayoutStampDate      null.String `json:"payout_stamp_date" db:"PayoutStampDate"`
	PayoutConfirm        int         `json:"payout_confirm" db:"PayoutConfirm"`
	PayoutConfirmDate    null.String `json:"payout_confirm_date" db:"PayoutConfirmDate"`
	UnsettledStatus      int         `json:"unsettled_status" db:"UnsettledStatus"`
	UnsettledStampDate   null.String `json:"unsettled_stamp_date" db:"UnsettledStampDate"`
	UnsettledConfirm     int         `json:"unsettled_confirm" db:"UnsettledConfirm"`
	UnsettledConfirmDate null.String `json:"unsettled_confirm_date" db:"UnsettledConfirmDate"`
	LastError            *string     `json:"last_error" db:"LastError"`
	BetRetVal            string      `json:"bet_ret_val" db:"BetRetVal"`
}
