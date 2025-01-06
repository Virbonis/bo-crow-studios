package router

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/config"
	"github.com/AxionHQ/tsubasa-admin/web/database"
	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/session"
	"github.com/google/uuid"
)

func RegisterAPIAuth() {
	Base.HandleFunc("/auth/login", login).Methods(http.MethodPost)
	Base.HandleFunc("/auth/logout", logout).Methods(http.MethodGet)
	Base.HandleFunc("/auth/account", getAccount).Methods(http.MethodGet)
	Base.HandleFunc("/auth/account", updateAccount).Methods(http.MethodPut)
	Base.HandleFunc("/auth/menu", getAuthMenu).Methods(http.MethodGet)
}

func login(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}
	// validate trim+toupper
	p.Username = strings.ToUpper(strings.TrimSpace(p.Username))
	p.Password = strings.ToUpper(strings.TrimSpace(p.Password))
	if p.Username == "" || p.Password == "" {
		httpError(w, http.StatusBadRequest, "Invalid input")
		return
	}

	m, err := database.GetUserInfo(p.Username)
	if err != nil {
		httpError(w, http.StatusUnauthorized, "Failed to get User Info")
		return
	} else if m == nil {
		httpError(w, http.StatusUnauthorized, "User not found")
		return
	}

	var errMsg string
	var isLoginValidated bool
	if !m.IsActive {
		errMsg = "User Inactive"
	} else if m.LoginFail > 2 && m.RetryLogin > 0 {
		errMsg = "Please Login in 10 Minutes"
	} else {
		upperCasePassword := strings.ToUpper(strings.TrimSpace(p.Password))
		encPassword := helper.GetMD5Hash(upperCasePassword)
		// compare uppercase password with uppercase encPassword
		if strings.EqualFold(strings.ToUpper(m.Password), strings.ToUpper(encPassword)) {
			isLoginValidated = true
			m.LoginFail = 0
		} else {
			errMsg = "Invalid Password"
			m.LoginFail += 1
			if m.LoginFail >= 3 {
				errMsg = "Invalid Password 3 times. Please Login in 10 Minutes"
			}
		}
		// update login fail
		err = database.UpdateUserInfo(m.UserID, m.LoginFail, p.Username)
		if err != nil {
			errMsg = "Failed update user login"
			isLoginValidated = false
		}
	}

	if isLoginValidated {
		sessionID := uuid.New().String()
		err := database.ProcUserLogin(m.UserID, sessionID, r.RemoteAddr, p.Username)
		if err != nil {
			httpError(w, http.StatusUnauthorized, "Failed process user login")
			return
		}

		now := time.Now().Local()
		s := session.UserSession{
			SessionID: sessionID,
			Expired:   now.Add(1 * 24 * time.Hour),
			User: session.UserInfoSession{
				Username:  p.Username,
				UserID:    m.UserID,
				Name:      m.Name,
				Email:     m.Email,
				LastLogin: m.LastLogin,
				RoleIDs:   m.RoleIDs,
				Roles:     m.Roles,
				Avatar:    m.Avatar,
			},
		}
		s.User.UserAuthIDs, _ = database.ListAuthByUser(m.UserID, p.Username)
		s.User.UserTeamID, _ = database.GetUserTeamID(p.Username)
		s.User.UserTeamSubID, _ = database.GetUserTeamSubID(p.Username)
		s.User.TraderGroupORI, s.User.TraderGroup = helper.GetTraderGroup(s.User.UserAuthIDs)
		// Store the session in redis database
		_ = s.StoreUserSession()
		token := s.EncryptTokenSession()

		writeJSON(w, statusSuccess, token)
		return
	}

	httpError(w, http.StatusUnauthorized, errMsg)
}

func getAccount(w http.ResponseWriter, r *http.Request) {
	userSession, err := session.GetRouterUserSession(r)
	if err != nil {
		httpError(w, http.StatusUnauthorized, "Session already expired")
		return
	}

	now := time.Now().Local()
	expired := now.Sub(userSession.Expired)
	if int(expired) > 0 {
		httpError(w, http.StatusUnauthorized, "Session already expired")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(userSession.User)
}

func updateAccount(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Name     string `json:"name"`
		Password string `json:"password"`
		Avatar   string `json:"avatar"`
	}
	err := json.NewDecoder(r.Body).Decode(&p)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	// validate trim+toupper
	p.Name = strings.TrimSpace(p.Name)
	p.Password = strings.ToUpper(strings.TrimSpace(p.Password))
	if p.Name == "" && p.Password == "" {
		httpError(w, http.StatusBadRequest, "Invalid input")
		return
	}

	encryptPassword := strings.ToUpper(helper.GetMD5Hash(strings.ToUpper(p.Password)))
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	userID := userInfo.UserID
	err = database.UpdateUserProfile(userID, p.Name, encryptPassword, p.Avatar, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	s := userSession
	s.User.Name = p.Name
	s.User.Avatar = p.Avatar
	token := s.EncryptTokenSession()
	// update redis session
	if config.AppConfig.Redis.Enabled {
		_ = s.StoreUserSession()
	}

	writeJSON(w, statusSuccess, token)
}

func getAuthMenu(w http.ResponseWriter, r *http.Request) {
	userSession, _ := session.GetRouterUserSession(r)
	userInfo := userSession.User
	stampUser := userInfo.Username
	result, err := database.ListMenu(false, stampUser)
	if err != nil {
		httpError(w, http.StatusBadRequest, err.Error())
		return
	}

	writeJSON(w, statusSuccess, result)
}

func logout(w http.ResponseWriter, r *http.Request) {
	userSession, err := session.GetRouterUserSession(r)
	if err != nil {
		httpError(w, http.StatusUnauthorized, "Session already expired")
		return
	}
	userSession.RemoveUserSession()
	writeJSON(w, statusSuccess, "OK")
}
