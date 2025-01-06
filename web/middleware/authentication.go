package middleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/AxionHQ/tsubasa-admin/web/session"
)

func AuthenticationAPIMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if strings.HasPrefix(r.URL.Path, "/api/") {
			if strings.HasSuffix(r.URL.Path, "/auth/login") {
				// continue as usual
			} else {

				userSession, err := session.GetUserSession(r)
				ctx = session.SetRouterUserSession(ctx, userSession)

				if err != nil {
					// httpError(w, http.StatusUnauthorized, "Forbidden")
					w.WriteHeader(http.StatusUnauthorized)
					fmt.Fprint(w, "Forbidden")
					return
				}
			}
		}
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
