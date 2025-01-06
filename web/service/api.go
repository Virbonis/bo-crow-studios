package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	log "github.com/sirupsen/logrus"
)

// BlaiseServer used to manage communication with BlaiseServer API
type BlaiseServer struct {
	BlaiseServerURL string
}

// Result is a http response from BlaiseServer API
type Result struct {
	Status int32       `json:"status"`
	Data   interface{} `json:"data"`
}

type ValidateSessionResponse struct {
	StatusCode string    `json:"status_code"`
	StatusText string    `json:"status_text"`
	Currency   string    `json:"currency"`
	MemberID   string    `json:"member_id"`
	MemberName string    `json:"member_name"`
	Datetime   time.Time `json:"datetime"`
	URL        string
}

var Base string

// NewBlaiseServer creates new BlaiseServer instance
func InitServiceAPI(url string) {
	Base = url
}

func (s *BlaiseServer) ProcessPayout(userID string, accessToken string, tableNumber int, drawNumber int) error {
	url := fmt.Sprintf("%s/tables/%d/reprocess?userID=%s&drawNumber=%d", s.BlaiseServerURL, tableNumber, userID, drawNumber)

	client := http.DefaultClient
	client.Timeout = 5 * time.Second

	req := httpRequest(client.Transport)
	req.Set("AccessToken", accessToken)
	client.Transport = req

	log.Debugf("Executing http POST to [%s]", url)
	response, err := client.Post(url, "application/json", bytes.NewBuffer([]byte{}))
	if err != nil {
		return err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("HTTP API returned error: %d", response.StatusCode)
	}

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("Response error: %v", err)
	}

	result := &Result{}

	err = json.Unmarshal(data, result)
	if err != nil {
		return fmt.Errorf("Response format error: %v", err)
	}

	if result.Status != 0 {
		return fmt.Errorf("Process payout returned error: %s", result.Data)
	}

	return nil
}

type requestHeader struct {
	http.Header
	rt http.RoundTripper
}

func httpRequest(rt http.RoundTripper) requestHeader {
	if rt == nil {
		rt = http.DefaultTransport
	}

	return requestHeader{Header: make(http.Header), rt: rt}
}

func (h requestHeader) RoundTrip(req *http.Request) (*http.Response, error) {
	for k, v := range h.Header {
		req.Header[k] = v
	}

	return h.rt.RoundTrip(req)
}
