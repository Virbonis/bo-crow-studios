package helper

import (
	"fmt"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/util"
)

/* file general.cs
 */
func GetLiveTimeElapsed(sportID, evRound int, evTimer time.Time, stInjuryHT, stInjuryFT string, injuryHT, injuryFT int, evCompareTimer time.Time, StopTimerCode string, now *time.Time) string {
	// todo check ini harusnya uda ga nullable time, karena yg lama convert.datetime uda ada default minValue
	// if evTimer.IsZero() {
	// 	evTimer = null.TimeFrom(now)
	// }
	// if evCompareTimer.IsZero() {
	// 	evCompareTimer = null.TimeFrom(now)
	// }

	var _totalMinutes int
	var liveTimer int
	var result string

	if !(util.Contains([]int{0, 4, 7}, evRound)) {
		switch sportID {
		case 10, 57: // Soccer, E-Soccer
			var injuryTime int
			if evRound == 1 && injuryHT > 0 && stInjuryHT == "Y" {
				injuryTime = injuryHT
			}
			if evRound == 3 && injuryFT > 0 && stInjuryFT == "Y" {
				injuryTime = injuryFT
			}

			_totalMinutes = int(now.Sub(evTimer).Minutes())
			if evRound == 1 || evRound == 3 {
				if _totalMinutes < 45+injuryTime {
					liveTimer = _totalMinutes
				} else {
					liveTimer = 45 + injuryTime
				}
			} else if evRound == 2 {
				liveTimer = _totalMinutes
			} else if evRound == 5 || evRound == 6 {
				if _totalMinutes < 15 {
					liveTimer = _totalMinutes
				} else {
					liveTimer = 15
				}
			} else {
				liveTimer = 0
			}
			if liveTimer >= 0 {
				result = fmt.Sprintf("%02d`", liveTimer)
				if injuryTime > 0 {
					result = fmt.Sprintf("%s +%d", result, injuryTime)
				}
			}
		case 12, 58, 53, 34: // Basket, E-Basketball, Netball, Football
			var timeToCompare time.Time
			arEvRound_53 := []int{11, 12, 13, 14, 15, 16, 19}
			if StopTimerCode == "N" {
				timeToCompare = *now
			} else {
				timeToCompare = evCompareTimer
			}

			_totalMinutes = int(evTimer.Sub(timeToCompare).Minutes())
			// liveTimer = ( ? (_totalMinutes >= 0 ? _totalMinutes : -1) : 0)
			if util.Contains(arEvRound_53, evRound) {
				if _totalMinutes >= 0 {
					liveTimer = _totalMinutes
				} else {
					liveTimer = -1
				}
			} else {
				liveTimer = 0
			}
			if liveTimer >= 0 {
				result = fmt.Sprintf("%02d`", liveTimer)
			}
			if StopTimerCode == "T" {
				result = result + "_T"
			}
		}
	}
	return GetEvRoundInfo(evRound) + " " + result
}

func GetEvRoundInfo(evRound int) string {
	var result string
	switch evRound {
	case 0:
		result = "Live"
	case 1:
		result = "1H"
	case 2:
		result = "HT"
	case 3:
		result = "2H"
	case 4:
		result = "FT"
	case 5:
		result = "E1"
	case 7:
		result = "ETHT"
	case 6:
		result = "E2"
	case 11:
		result = "Q1"
	case 12:
		result = "Q2"
	case 13:
		result = "Q3"
	case 14:
		result = "Q4"
	case 15:
		result = "1H"
	case 16:
		result = "2H"
	case 19:
		result = "OT"
	case 31:
		result = "R1"
	case 32:
		result = "R2"
	case 33:
		result = "R3"
	case 34:
		result = "R4"
	case 355:
		result = "R5"
	default:
		result = ""
	}

	return result
}
