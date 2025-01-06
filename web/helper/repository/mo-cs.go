package repository

import (
	"fmt"
	"math"

	"github.com/AxionHQ/tsubasa-admin/web/model"
)

type LineMOCS struct {
	ArrMatch map[string]interface{}
	ArrScore []map[string]interface{}
}

func ConvertToArrayLineMOCS(list []model.MOCS) []LineMOCS {
	arrLine := []LineMOCS{}
	for index, row := range list {
		// if matchid or gametype not same as previous, create new object
		if len(arrLine) == 0 || row.MatchID != list[index-1].MatchID || row.GameType != list[index-1].GameType {
			newLine := LineMOCS{}
			newLine.setArrMatch(&row)
			arrLine = append(arrLine, newLine)
		}
		// add score
		arrLine[len(arrLine)-1].setArrScore(&row)
	}
	return arrLine
}

func (line *LineMOCS) setArrMatch(row *model.MOCS) {
	homeName := row.HomeName
	if row.GameType > 1001 {
		homeName = fmt.Sprintf("1h-%s", row.HomeName)
	}
	line.ArrMatch = map[string]interface{}{
		"row_id":      fmt.Sprintf("%d-%d", row.MatchID, row.GameType), // penomoran tiap line
		"match_id":    row.MatchID,
		"home_name":   homeName,
		"away_name":   row.AwayName,
		"home_posisi": row.HomePosisi,
		"away_posisi": row.AwayPosisi,
		"sport_id":    row.SportID,
		"match_date":  row.MatchDate.Format("02-Jan-2006 15:04"),
		"league_id":   row.LeagueID,
		"home_id":     row.HomeID,
		"away_id":     row.AwayID,
		"game_type":   row.GameType,
		"st_penalty":  row.STPenalty,
		"home_rc":     row.HomeRC,
		"away_rc":     row.AwayRC,
		"limit_id":    row.LimitID,
	}
}
func (line *LineMOCS) setArrScore(row *model.MOCS) {
	totalBet := row.TotalBet
	totalTicket := row.Total
	var stock float64
	if totalBet != 0 && totalTicket != 0 {
		stock = math.Round(float64(totalTicket)/float64(totalBet)*100) / 100
	}

	line.ArrScore = append(line.ArrScore, map[string]interface{}{
		"home_score":             row.HomeScore,
		"away_score":             row.AwayScore,
		"score":                  row.Score,
		"odds":                   row.Odds,
		"sub_match_open_status":  row.SubMatchOpenStatus,
		"sub_match_pause_status": row.SubMatchPauseStatus,
		"choice_code":            row.ChoiceCode,
		"stock":                  stock,
		"show_stock":             totalBet != 0 && totalTicket != 0,
	})
}
