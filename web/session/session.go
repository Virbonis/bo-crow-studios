package session

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/cache"
	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/model"
	log "github.com/sirupsen/logrus"
)

const sessionEncryptionKey = "gVkYp3s6v9y$B&E)"

type ContextKey string

// Mendefinisikan key khusus
var UserSessionKey = ContextKey("userSession")

// data stored in redis
type UserSession struct {
	SessionID string          `json:"session_id"`
	Expired   time.Time       `json:"expired"`
	User      UserInfoSession `json:"user"`
}
type UserInfoSession struct {
	Username       string           `json:"username"`
	UserID         int              `json:"user_id"`
	Name           string           `json:"name"`
	Email          string           `json:"email"`
	LastLogin      time.Time        `json:"last_login"`
	RoleIDs        string           `json:"role_ids"`
	Roles          string           `json:"roles"`
	Avatar         string           `json:"avatar"`
	UserAuthIDs    []model.UserAuth `json:"user_auth_ids"`
	UserTeamID     int              `json:"user_team_id"`
	UserTeamSubID  int              `json:"user_team_sub_id"`
	TraderGroupORI string           `json:"trader_group_ori"`
	TraderGroup    string           `json:"trader_group"`
}

func (u UserInfoSession) GetUserAuthIDs() []model.UserAuth {
	if !config.AppConfig.Redis.Enabled {
		u.UserAuthIDs, _ = database.ListAuthByUser(u.UserID, u.Username)
	}
	return u.UserAuthIDs
}
func (u UserInfoSession) GetUserTeamID() int {
	if !config.AppConfig.Redis.Enabled {
		u.UserTeamID, _ = database.GetUserTeamID(u.Username)
	}
	return u.UserTeamID
}
func (u UserInfoSession) GetUserTeamSubID() int {
	if !config.AppConfig.Redis.Enabled {
		u.UserTeamSubID, _ = database.GetUserTeamSubID(u.Username)
	}
	return u.UserTeamSubID
}
func (u UserInfoSession) GetTraderGroupORI() string {
	if !config.AppConfig.Redis.Enabled {
		u.TraderGroupORI, u.TraderGroup = helper.GetTraderGroup(u.GetUserAuthIDs())
	}
	return u.TraderGroupORI
}
func (u UserInfoSession) GetTraderGroup() string {
	if !config.AppConfig.Redis.Enabled {
		u.TraderGroupORI, u.TraderGroup = helper.GetTraderGroup(u.GetUserAuthIDs())
	}
	return u.TraderGroup
}

// data stored in token
type SessionToken struct {
	SessionID string `json:"session_id"`
	UserID    string `json:"user_id"`
	Username  string `json:"username"`
}

func GetUserSession(r *http.Request) (*UserSession, error) {
	accessToken := r.Header.Get("AccessToken")
	// Decrypt access token
	token, err := decryptTokenSession(accessToken)
	if err != nil {
		return nil, err
	}

	if config.AppConfig.Redis.Enabled {
		// Get the session from cache
		result, err := cache.GetWebUserSession(token.UserID)
		if err != nil {
			return nil, err
		}

		session := &UserSession{}
		if err := json.Unmarshal([]byte(result), session); err != nil {
			return nil, err
		}

		// Compare sessionID in redis with the one in browser
		if !strings.EqualFold(session.SessionID, token.SessionID) {
			return nil, fmt.Errorf("Session already expired")
		}

		// This is valid session
		return session, nil
	} else {
		m, err := database.GetUserInfo(token.Username)
		if err != nil {
			return nil, fmt.Errorf("Failed to get User Info")
		} else if m == nil {
			return nil, fmt.Errorf("User not found")
		}
		s := &UserSession{
			SessionID: token.SessionID,
			Expired:   time.Now().Local().Add(1 * 24 * time.Hour),
			User: UserInfoSession{
				Username:  token.Username,
				UserID:    m.UserID,
				Name:      m.Name,
				Email:     m.Email,
				LastLogin: m.LastLogin,
				RoleIDs:   m.RoleIDs,
				Roles:     m.Roles,
				Avatar:    m.Avatar,
			},
		}
		s.User.UserAuthIDs = s.User.GetUserAuthIDs()
		s.User.UserTeamID = s.User.GetUserTeamID()
		s.User.UserTeamSubID = s.User.GetUserTeamSubID()
		s.User.TraderGroupORI = s.User.GetTraderGroupORI()
		s.User.TraderGroup = s.User.GetTraderGroup()
		return s, nil
	}
}
func (session *UserSession) StoreUserSession() error {
	s, _ := json.Marshal(session)
	return cache.CreateWebUserSession(strconv.Itoa(session.User.UserID), string(s))
}
func (session *UserSession) RemoveUserSession() error {
	return cache.DeleteWebUserSession(strconv.Itoa(session.User.UserID))
}

func (session UserSession) EncryptTokenSession() string {
	token := &SessionToken{
		SessionID: session.SessionID,
		UserID:    strconv.Itoa(session.User.UserID),
		Username:  session.User.Username,
	}

	jsonData, err := json.Marshal(token)
	if err != nil {
		log.Warnf("Error generating acess token %v", err)
		return ""
	}

	key := []byte(sessionEncryptionKey)

	ciphertext, err := helper.EncryptToken(key, jsonData)
	if err != nil {
		log.Warnf("Error generating acess token %v", err)
		return ""
	}

	return base64.URLEncoding.EncodeToString(ciphertext)
}
func decryptTokenSession(token string) (*SessionToken, error) {
	// token is base64 decoded string
	decodedByte, err := base64.URLEncoding.DecodeString(token)
	if err != nil {
		log.Debugf("AccessToken - Base64 decode error: %v accessToken: %s", err, token)
		return nil, err
	}

	key := []byte(sessionEncryptionKey)
	jsonData, err := helper.DecryptToken(key, decodedByte)
	if err != nil {
		log.Debugf("AccessToken - Unable to decrypt token. Crypto error: %v", err)
		return nil, err
	}

	sessionToken := &SessionToken{}

	err = json.Unmarshal(jsonData, sessionToken)
	if err != nil {
		log.Debugf("AccessToken - JSON error: %v", err)
		return nil, err
	}

	return sessionToken, nil
}

func GetRouterUserSession(r *http.Request) (*UserSession, error) {
	return r.Context().Value(UserSessionKey).(*UserSession), nil
}

func SetRouterUserSession(ctx context.Context, userSession *UserSession) context.Context {
	return context.WithValue(ctx, UserSessionKey, userSession)
}
