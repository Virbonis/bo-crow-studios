package repository

import (
	"fmt"
	"math"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/AxionHQ/tsubasa-admin/web/util"
)

var listGTAHSW = []int{0, 2, 1101, 1104, 1107, 1110, 1113, 1241, 1242, 1243, 1244}       // 0, 2, 1101, 1104, 1107, 1110, 1113
var listGTOUGOU = []int{5, 6, 61, 1103, 1106, 1109, 1112, 1115, 1245, 1246, 1247, 1248}  // 5, 6, 61, 1103, 1106, 1109, 1112, 1115
var listGTOEGOE = []int{3, 16, 62, 1116, 1117, 1118, 1119, 1120, 1249, 1250, 1251, 1252} // 3, 16, 62, 1116, 1117, 1118, 1119, 1120
var listGTGAH = []int{50, 1102, 1105, 1108, 1111, 1114}                                  // 50, 1102, 1105, 1108, 1111, 1114
var listGTML = []int{12, 17, 18, 1253, 1254, 1255, 1256}

type LineMO struct {
	ArrMatch map[string]interface{}
	ArrHDP   map[string]interface{}
	ArrOU    map[string]interface{}
	ArrOE    map[string]interface{}
	ArrML    map[string]interface{}
	Arr1X2   map[string]interface{}
	ArrGAH   map[string]interface{}
}

func ConvertToArrayLineMO(list []model.MO) []LineMO {
	arrLine := []LineMO{}
	now := database.GetDateTimeDBServer()
	for index, row := range list {
		// if matchid or displayadmin not same as previous, create new object
		if len(arrLine) == 0 || row.MatchID != list[index-1].MatchID || row.DisplayAdmin != list[index-1].DisplayAdmin {
			newLine := LineMO{}
			newLine.setArrMatch(&row, &now)
			arrLine = append(arrLine, newLine)
		}
		arrLine[len(arrLine)-1].setArrHDP(&row)
		arrLine[len(arrLine)-1].setArrOU(&row)
		arrLine[len(arrLine)-1].setArrOE(&row)
		arrLine[len(arrLine)-1].setArrML(&row)
		arrLine[len(arrLine)-1].setArrGAH(&row)
		arrLine[len(arrLine)-1].setArr1X2(&row)
	}
	return arrLine
}
func (line *LineMO) setArrMatch(row *model.MO, now *time.Time) {

	matchFollowRball := ""
	if row.STFollowRBall == 1 {
		matchFollowRball = "R"
	}
	line.ArrMatch = map[string]interface{}{
		"row_id":                 fmt.Sprintf("%d-%d", row.MatchID, row.DisplayAdmin), // penomoran tiap line
		"match_id":               row.MatchID,
		"display_admin":          row.DisplayAdmin,
		"home_name":              fmt.Sprintf("%s%s", getDisplayRound(row.DisplayAdmin, row.SportID), row.HomeName),
		"away_name":              row.AwayName,
		"home_posisi":            row.HomePosisi,
		"away_posisi":            row.AwayPosisi,
		"home_rc":                row.HomeRC,
		"away_rc":                row.AwayRC,
		"st_fav":                 row.SubMatchFavStatus,
		"st_live":                row.MatchLiveStatus,
		"st_open":                row.MatchOpenStatus,
		"st_pause":               row.MatchPauseStatus,
		"match_round":            row.MatchRound,
		"match_elapsed":          row.MatchElapsed,
		"ht_process":             row.HTProcess,
		"ft_process":             row.FTProcess,
		"fglg_process":           row.FGLGProcess,
		"ht_home_score":          row.HTHomeScore,
		"ht_away_score":          row.HTAwayScore,
		"fs_home_score":          row.FSHomeScore,
		"fs_away_score":          row.FSAwayScore,
		"fglg_first_goal":        row.FGLGFirstGoal,
		"fglg_last_goal":         row.FGLGLastGoal,
		"fglg_count":             row.FGLGCount,
		"neutral_ground":         row.NeutralGround,
		"match_auto_odds":        row.MatchAutoOdds,
		"ev_odds_step_ah":        row.EvOddsStepAH,
		"ev_odds_step_ou":        row.EvOddsStepOU,
		"sport_id":               row.SportID,
		"st_injury_ht":           row.STInjuryHT,
		"st_injury_ft":           row.STInjuryFT,
		"injury_ht":              row.InjuryHT,
		"injury_ft":              row.InjuryFT,
		"match_follow_rball":     matchFollowRball,
		"st_penalty":             row.STPenalty,
		"total_score":            row.HomePosisi + row.AwayPosisi,
		"elapsed_live":           helper.GetLiveTimeElapsed(row.SportID, row.MatchRound, row.EvTimer, row.STInjuryHT, row.STInjuryFT, row.InjuryHT, row.InjuryFT, row.EvCompareTimer, row.STStopTimer, now),
		"home_yc":                row.HomeYC,
		"away_yc":                row.AwayYC,
		"match_date":             row.MatchDate.Format("02-Jan-2006 15:04"),
		"league_id":              row.LeagueID,
		"home_id":                row.HomeID,
		"away_id":                row.AwayID,
		"early_settlement_alert": row.EarlySettlementAlert,
		"limit_id":               row.LimitID,
	}
}
func (line *LineMO) setArrHDP(row *model.MO) {
	if util.Contains(listGTAHSW, row.GameType) {
		oddsHDP := row.OddsHome
		if row.SubMatchFavStatus <= 0 {
			oddsHDP = row.OddsAway
		}
		line.ArrHDP = map[string]interface{}{
			"alert_trader_ha":                   row.AlertTraderHA,
			"alert_trader_handicap":             row.AlertTraderHandicap,
			"alert_trader_ldiff":                row.AlertTraderLDiff,
			"alert_trader_odds":                 row.AlertTraderOdds,
			"alert_trader_spread":               row.AlertTraderSpread,
			"display_admin":                     row.DisplayAdmin,
			"ev_update_odds":                    row.EvUpdateOdds,
			"game_type":                         row.GameType,
			"handicap":                          math.Abs(row.Handicap),
			"last_change_ha":                    row.LastUpdateHA,
			"last_change_handicap":              row.LastChangeHandicap,
			"last_change_ldiff":                 row.LastChangeLDiff,
			"last_change_odds":                  row.LastUpdateOdds,
			"last_change_spread":                row.LastChangeSpread,
			"ldiff":                             row.LDiff,
			"link_odds_diff":                    row.LinkOddsDiff,
			"odds_away":                         row.OddsAway,
			"odds_home":                         row.OddsHome,
			"odds_name":                         row.OddsName.ValueOrZero(),
			"odds":                              oddsHDP,
			"reason_pause":                      row.ReasonPause,
			"show_auto_odds":                    row.ShowAutoOdds,
			"show_stock":                        (row.THome != 0 || row.TAway != 0),
			"spread":                            row.SpreadPerc.ValueOrZero(),
			"st_4point_diff":                    row.ST4PointDiff,
			"st_auto_odds":                      row.AutoOdds,
			"st_auto_pause":                     row.AutoPause,
			"st_fav":                            row.SubMatchFavStatus,
			"st_open":                           row.SubMatchOpenStatus,
			"st_pause":                          row.SubMatchPauseStatus,
			"stock":                             math.Round((row.THome-row.TAway)/10) / 100,
			"sub_match_id":                      row.SubMatchID,
			"trader_group_ha":                   row.TraderGroupHA,
			"trader_group_hdc_display":          row.TraderGroupHdcDisplay,
			"trader_group_leeching_spread_odds": row.TraderGroupLeechingSpreadOdds,
			"trader_group_odds_step_mapping":    row.TraderGroupOddsStepMapping,
			"trader_group_odds":                 row.TraderGroup,
		}
	}
}
func (line *LineMO) setArrOU(row *model.MO) {
	if util.Contains(listGTOUGOU, row.GameType) {
		oddsOU := row.OddsHome
		if row.SubMatchFavStatus <= 0 {
			oddsOU = row.OddsAway
		}
		line.ArrOU = map[string]interface{}{
			"alert_trader_ha":                   row.AlertTraderHA,
			"alert_trader_handicap":             row.AlertTraderHandicap,
			"alert_trader_ldiff":                row.AlertTraderLDiff,
			"alert_trader_odds":                 row.AlertTraderOdds,
			"alert_trader_spread":               row.AlertTraderSpread,
			"display_admin":                     row.DisplayAdmin,
			"ev_update_odds":                    row.EvUpdateOdds,
			"game_type":                         row.GameType,
			"handicap":                          math.Abs(row.Handicap),
			"last_change_ha":                    row.LastUpdateHA,
			"last_change_handicap":              row.LastChangeHandicap,
			"last_change_ldiff":                 row.LastChangeLDiff,
			"last_change_odds":                  row.LastUpdateOdds,
			"last_change_spread":                row.LastChangeSpread,
			"ldiff":                             row.LDiff,
			"link_odds_diff":                    row.LinkOddsDiff,
			"odds_away":                         row.OddsAway,
			"odds_home":                         row.OddsHome,
			"odds_name":                         row.OddsName.ValueOrZero(),
			"odds":                              oddsOU,
			"reason_pause":                      row.ReasonPause,
			"show_auto_odds":                    row.ShowAutoOdds,
			"show_stock":                        (row.THome != 0 || row.TAway != 0),
			"spread":                            row.SpreadPerc.ValueOrZero(),
			"st_4point_diff":                    row.ST4PointDiff,
			"st_auto_odds":                      row.AutoOdds,
			"st_auto_pause":                     row.AutoPause,
			"st_fav":                            row.SubMatchFavStatus,
			"st_open":                           row.SubMatchOpenStatus,
			"st_pause":                          row.SubMatchPauseStatus,
			"stock":                             math.Round((row.THome-row.TAway)/10) / 100,
			"sub_match_id":                      row.SubMatchID,
			"trader_group_ha":                   row.TraderGroupHA,
			"trader_group_hdc_display":          row.TraderGroupHdcDisplay,
			"trader_group_leeching_spread_odds": row.TraderGroupLeechingSpreadOdds,
			"trader_group_odds_step_mapping":    row.TraderGroupOddsStepMapping,
			"trader_group_odds":                 row.TraderGroup,
		}
	}
}
func (line *LineMO) setArrOE(row *model.MO) {
	if util.Contains(listGTOEGOE, row.GameType) {
		odds := row.OddsHome
		if row.SubMatchFavStatus <= 0 {
			odds = row.OddsAway
		}
		line.ArrOE = map[string]interface{}{
			"alert_trader_ha":                   row.AlertTraderHA,
			"alert_trader_handicap":             row.AlertTraderHandicap,
			"alert_trader_ldiff":                row.AlertTraderLDiff,
			"alert_trader_odds":                 row.AlertTraderOdds,
			"alert_trader_spread":               row.AlertTraderSpread,
			"display_admin":                     row.DisplayAdmin,
			"ev_update_odds":                    row.EvUpdateOdds,
			"game_type":                         row.GameType,
			"handicap":                          math.Abs(row.Handicap),
			"last_change_ha":                    row.LastUpdateHA,
			"last_change_handicap":              row.LastChangeHandicap,
			"last_change_ldiff":                 row.LastChangeLDiff,
			"last_change_odds":                  row.LastUpdateOdds,
			"last_change_spread":                row.LastChangeSpread,
			"ldiff":                             row.LDiff,
			"link_odds_diff":                    row.LinkOddsDiff,
			"odds_away":                         row.OddsAway,
			"odds_home":                         row.OddsHome,
			"odds_name":                         row.OddsName.ValueOrZero(),
			"odds":                              odds,
			"reason_pause":                      row.ReasonPause,
			"show_auto_odds":                    row.ShowAutoOdds,
			"show_stock":                        (row.THome != 0 || row.TAway != 0),
			"spread":                            row.SpreadPerc.ValueOrZero(),
			"st_4point_diff":                    row.ST4PointDiff,
			"st_auto_odds":                      row.AutoOdds,
			"st_auto_pause":                     row.AutoPause,
			"st_fav":                            row.SubMatchFavStatus,
			"st_open":                           row.SubMatchOpenStatus,
			"st_pause":                          row.SubMatchPauseStatus,
			"stock":                             math.Round((row.THome-row.TAway)/10) / 100,
			"sub_match_id":                      row.SubMatchID,
			"trader_group_ha":                   row.TraderGroupHA,
			"trader_group_hdc_display":          row.TraderGroupHdcDisplay,
			"trader_group_leeching_spread_odds": row.TraderGroupLeechingSpreadOdds,
			"trader_group_odds_step_mapping":    row.TraderGroupOddsStepMapping,
			"trader_group_odds":                 row.TraderGroup,
		}
	}
}
func (line *LineMO) setArrML(row *model.MO) {
	if util.Contains(listGTML, row.GameType) {
		odds := row.OddsHome
		if row.SubMatchFavStatus <= 0 {
			odds = row.OddsAway
		}
		line.ArrML = map[string]interface{}{
			"alert_trader_ha":                   row.AlertTraderHA,
			"alert_trader_handicap":             row.AlertTraderHandicap,
			"alert_trader_ldiff":                row.AlertTraderLDiff,
			"alert_trader_odds":                 row.AlertTraderOdds,
			"alert_trader_spread":               row.AlertTraderSpread,
			"display_admin":                     row.DisplayAdmin,
			"ev_update_odds":                    row.EvUpdateOdds,
			"game_type":                         row.GameType,
			"handicap":                          math.Abs(row.Handicap),
			"last_change_ha":                    row.LastUpdateHA,
			"last_change_handicap":              row.LastChangeHandicap,
			"last_change_ldiff":                 row.LastChangeLDiff,
			"last_change_odds":                  row.LastUpdateOdds,
			"last_change_spread":                row.LastChangeSpread,
			"ldiff":                             row.LDiff,
			"link_odds_diff":                    row.LinkOddsDiff,
			"odds_away":                         row.OddsAway,
			"odds_home":                         row.OddsHome,
			"odds_name":                         row.OddsName.ValueOrZero(),
			"odds":                              odds,
			"reason_pause":                      row.ReasonPause,
			"show_auto_odds":                    row.ShowAutoOdds,
			"show_stock":                        (row.THome != 0 || row.TAway != 0),
			"spread":                            row.SpreadPerc.ValueOrZero(),
			"st_4point_diff":                    row.ST4PointDiff,
			"st_auto_odds":                      row.AutoOdds,
			"st_auto_pause":                     row.AutoPause,
			"st_fav":                            row.SubMatchFavStatus,
			"st_open":                           row.SubMatchOpenStatus,
			"st_pause":                          row.SubMatchPauseStatus,
			"stock":                             math.Round((row.THome-row.TAway)/10) / 100,
			"sub_match_id":                      row.SubMatchID,
			"trader_group_ha":                   row.TraderGroupHA,
			"trader_group_hdc_display":          row.TraderGroupHdcDisplay,
			"trader_group_leeching_spread_odds": row.TraderGroupLeechingSpreadOdds,
			"trader_group_odds_step_mapping":    row.TraderGroupOddsStepMapping,
			"trader_group_odds":                 row.TraderGroup,
		}
	}
}
func (line *LineMO) setArrGAH(row *model.MO) {
	if util.Contains(listGTGAH, row.GameType) {
		odds := row.OddsHome
		if row.SubMatchFavStatus <= 0 {
			odds = row.OddsAway
		}
		line.ArrGAH = map[string]interface{}{
			"alert_trader_ha":                   row.AlertTraderHA,
			"alert_trader_handicap":             row.AlertTraderHandicap,
			"alert_trader_ldiff":                row.AlertTraderLDiff,
			"alert_trader_odds":                 row.AlertTraderOdds,
			"alert_trader_spread":               row.AlertTraderSpread,
			"display_admin":                     row.DisplayAdmin,
			"ev_update_odds":                    row.EvUpdateOdds,
			"game_type":                         row.GameType,
			"handicap":                          math.Abs(row.Handicap),
			"last_change_ha":                    row.LastUpdateHA,
			"last_change_handicap":              row.LastChangeHandicap,
			"last_change_ldiff":                 row.LastChangeLDiff,
			"last_change_odds":                  row.LastUpdateOdds,
			"last_change_spread":                row.LastChangeSpread,
			"ldiff":                             row.LDiff,
			"link_odds_diff":                    row.LinkOddsDiff,
			"odds_away":                         row.OddsAway,
			"odds_home":                         row.OddsHome,
			"odds_name":                         row.OddsName.ValueOrZero(),
			"odds":                              odds,
			"reason_pause":                      row.ReasonPause,
			"show_auto_odds":                    row.ShowAutoOdds,
			"show_stock":                        (row.THome != 0 || row.TAway != 0),
			"spread":                            row.SpreadPerc.ValueOrZero(),
			"st_4point_diff":                    row.ST4PointDiff,
			"st_auto_odds":                      row.AutoOdds,
			"st_auto_pause":                     row.AutoPause,
			"st_fav":                            row.SubMatchFavStatus,
			"st_open":                           row.SubMatchOpenStatus,
			"st_pause":                          row.SubMatchPauseStatus,
			"stock":                             math.Round((row.THome-row.TAway)/10) / 100,
			"sub_match_id":                      row.SubMatchID,
			"trader_group_ha":                   row.TraderGroupHA,
			"trader_group_hdc_display":          row.TraderGroupHdcDisplay,
			"trader_group_leeching_spread_odds": row.TraderGroupLeechingSpreadOdds,
			"trader_group_odds_step_mapping":    row.TraderGroupOddsStepMapping,
			"trader_group_odds":                 row.TraderGroup,
		}
	}
}
func (line *LineMO) setArr1X2(row *model.MO) {
	if row.GameType == 1 || row.GameType == 8 {
		line.Arr1X2 = map[string]interface{}{
			"alert_stock":            row.AlertStock1x2,
			"alert_trader_odds_away": row.AlertTraderOddsAway,
			"alert_trader_odds_draw": row.AlertTraderOddsDraw,
			"alert_trader_odds_home": row.AlertTraderOddsHome,
			"display_admin":          row.DisplayAdmin,
			"game_type":              row.GameType,
			"last_change_odds_away":  row.LastUpdateOddsAway,
			"last_change_odds_draw":  row.LastUpdateOddsDraw,
			"last_change_odds_home":  row.LastUpdateOddsHome,
			"lock_shift":             row.LockShift,
			"odds_away":              row.OddsAway,
			"odds_draw":              row.OddsDraw,
			"odds_home":              row.OddsHome,
			"profile":                row.Profile1x2,
			"reason_pause":           row.ReasonPause,
			"show_auto_odds":         row.ShowAutoOdds,
			"show_stock":             (row.THome != 0 || row.TAway != 0 || row.TDraw != 0),
			"spread":                 row.Spread1x2,
			"st_auto_calc_odds":      row.AutoCalcOddsStatus,
			"st_auto_odds":           row.AutoOdds,
			"st_auto_pause":          row.AutoPause,
			"st_open":                row.SubMatchOpenStatus,
			"st_pause":               row.SubMatchPauseStatus,
			"stock":                  math.Round((row.THome+row.TAway+row.TDraw)*100) / 100,
			"sub_match_id":           row.SubMatchID,
			"trader_group":           row.TraderGroup,
		}
	}
}

func getDisplayRound(displayAdmin, sportID int) string {
	result := ""
	if displayAdmin > 30 {
		result = "1H-"
	}
	if sportID == 11 || sportID == 32 {
		// 11: tennis, 32: badminton
		if displayAdmin == 11 {
			result = "S1-"
		}
		if displayAdmin == 14 {
			result = "S2-"
		}
		if displayAdmin == 17 {
			result = "S3-"
		}
		if displayAdmin == 20 {
			result = "S4-"
		}
		if displayAdmin == 23 {
			result = "S5-"
		}
	} else if sportID == 12 || sportID == 58 {
		// 12: basketball, 58: ebasketball
		if displayAdmin == 41 {
			result = "Q1-"
		}
		if displayAdmin == 44 {
			result = "Q2-"
		}
		if displayAdmin == 47 {
			result = "Q3-"
		}
		if displayAdmin == 50 {
			result = "Q4-"
		}
	}
	return result
}
