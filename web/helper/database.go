package helper

import (
	"database/sql"
	"fmt"
	"strings"
)

func GenerateParamRF(dbName, spName string, parameters []interface{}) string {
	params := []string{}
	for _, param := range parameters {
		if p, ok := param.(sql.NamedArg); ok {
			if _, ok := p.Value.(string); ok {
				params = append(params, fmt.Sprintf("@%s='%v'", p.Name, p.Value))
			} else {
				params = append(params, fmt.Sprintf("@%s=%v", p.Name, p.Value))
			}
		}
	}
	commandText := fmt.Sprintf("%s.dbo.%s %s", dbName, spName, strings.Join(params, ", "))
	return commandText
}
