package util

import (
	"fmt"
	"math"
	"reflect"
	"strings"
	"unicode"
)

// boolToString
func BTS(b bool) string {
	if b {
		return "1"
	}
	return "0"
}

// stringToBool
// strconv.ParseBool(string("xxx"))

func ArrayIntToString(a []int, delim string) string {
	return strings.Trim(strings.Replace(fmt.Sprint(a), " ", delim, -1), "[]")
	//return strings.Trim(strings.Join(strings.Split(fmt.Sprint(a), " "), delim), "[]")
	//return strings.Trim(strings.Join(strings.Fields(fmt.Sprint(a)), delim), "[]")
}

func Contains(array interface{}, data interface{}) bool {
	switch reflect.TypeOf(array).Kind() {
	case reflect.Slice:
		arr := reflect.ValueOf(array)
		for i := 0; i < arr.Len(); i++ {
			if arr.Index(i).Interface() == reflect.ValueOf(data).Interface() {
				return true
			}
		}
		return false
	}
	return false
}

func MapBytesToString(m map[string]interface{}) {
	for k, v := range m {
		if b, ok := v.([]byte); ok {
			m[k] = string(b)
		}
	}
}

func round(num float64) int {
	return int(num + math.Copysign(0.5, num))
}

func ToFixed(num float64, precision int) float64 {
	output := math.Pow(10, float64(precision))
	return float64(round(num*output)) / output
}

func TrimNonLetterNonNumber(original string) string {
	return strings.TrimFunc(original, func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsNumber(r)
	})
}
