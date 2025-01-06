package middleware

import (
	"fmt"
	"net/http"

	"github.com/AxionHQ/tsubasa-admin/web/helper"
	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func AuthorizationAPIMiddleware(nextHandler http.HandlerFunc, authCode int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userSession, err := session.GetRouterUserSession(r)
		if userSession == nil || err != nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprint(w, "Access Denied")
		}
		userAuthIDs := userSession.User.GetUserAuthIDs()
		isAuthValid := helper.IsAuthInclude(userAuthIDs, authCode)
		if !isAuthValid {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprint(w, "Access Denied")
		} else {
			nextHandler.ServeHTTP(w, r)
		}
	}
}

func AuthorizationAPIMiddlewareDisallow(nextHandler http.HandlerFunc, authCode int) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userSession, err := session.GetRouterUserSession(r)
		if userSession == nil || err != nil {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprint(w, "Access Denied")
		}
		userAuthIDs := userSession.User.UserAuthIDs
		isAuthValid := !helper.IsAuthInclude(userAuthIDs, authCode)
		if !isAuthValid {
			w.WriteHeader(http.StatusForbidden)
			fmt.Fprint(w, "Access Denied")
		} else {
			nextHandler.ServeHTTP(w, r)
		}
	}
}
