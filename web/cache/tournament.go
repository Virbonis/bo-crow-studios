package cache

import (
	"encoding/json"

	"github.com/AxionHQ/tsubasa-admin/web/model"
	"github.com/go-redis/redis/v7"
	log "github.com/sirupsen/logrus"
)

const standingsKey = "sb:standings"
const knockoutsKey = "sb:knockouts"

// sepaket
func DeleteTournament(tournament string) (error, error) {
	return deleteStandings(tournament), deleteKnockOuts(tournament)
}
func deleteStandings(tournament string) (err error) {
	if tournament != "" {
		err = redisConnection.HDel(standingsKey, tournament).Err()
	} else {
		err = redisConnection.Del(standingsKey).Err()
	}

	if err != nil {
		log.Errorf("[cache] Unable to remove %s, data: error: %q", standingsKey, err)
		return
	}
	return nil
}
func deleteKnockOuts(tournament string) (err error) {
	if tournament != "" {
		err = redisConnection.HDel(knockoutsKey, tournament).Err()
	} else {
		err = redisConnection.Del(knockoutsKey).Err()
	}
	if err != nil {
		log.Errorf("[cache] Unable to remove %s, data: error: %q", knockoutsKey, err)
		return
	}
	return nil
}

func DeleteTournamentByTeamID(teamID int) (error, error) {
	return deleteStandingsByTeamID(teamID), deleteKnockoutsByTeamID(teamID)
}
func deleteStandingsByTeamID(teamID int) (err error) {
	allTeams, err := getAllTeams(standingsKey)
	if err != nil {
		return err
	}
	for tournament, teams := range allTeams {
		isExist := false
		for _, team := range teams {
			if team.NoTeam == teamID {
				isExist = true
				break
			}
		}
		if isExist {
			deleteStandings(tournament)
		}
	}
	return nil
}
func deleteKnockoutsByTeamID(teamID int) (err error) {
	allTeams, err := getAllTeams(knockoutsKey)
	if err != nil {
		return err
	}
	for tournament, teams := range allTeams {
		isExist := false
		for _, team := range teams {
			if team.NoTeam == teamID {
				isExist = true
				break
			}
		}
		if isExist {
			deleteKnockOuts(tournament)
		}
	}
	return nil
}

func getAllTeams(key string) (map[string][]model.TeamSelect, error) {
	val, err := redisConnection.HGet(key, "AllTeams").Result()
	if err != nil && err != redis.Nil {
		log.Errorf("[cache] Unable to get %s, error: %q", key, err)
		return nil, err
	}

	allTeams := map[string][]model.TeamSelect{}
	if err != redis.Nil {
		err = json.Unmarshal([]byte(val), &allTeams)
		if err != nil {
			log.Errorf("[cache] JSON unmarshal %s, error: %v, data: %s", key, err, val)
			return nil, err
		}
	}
	return allTeams, nil
}
func setAllTeams(key, tournament string, teams []model.TeamSelect) error {
	allTeams, err := getAllTeams(key)
	if err != nil {
		return err
	}
	allTeams[tournament] = teams
	jsonData, err := json.Marshal(allTeams)
	if err != nil {
		log.Errorf("[cache] JSON marshal %s, error: %v, data: %s", key, err, jsonData)
		return err
	}
	err = redisConnection.HSet(key, "AllTeams", jsonData).Err()
	if err != nil {
		log.Errorf("[cache] Unable to set %s, error: %q", key, err)
		return err
	}
	return nil
}
func SetStandingsAllTeams(tournament string, teams []model.TeamSelect) error {
	return setAllTeams(standingsKey, tournament, teams)
}
func SetKnockOutsAllTeams(tournament string, teams []model.TeamSelect) error {
	return setAllTeams(knockoutsKey, tournament, teams)
}
