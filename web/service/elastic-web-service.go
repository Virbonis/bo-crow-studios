package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/AxionHQ/tsubasa-admin/web/config"
	log "github.com/sirupsen/logrus"
)

func CallResetEngine() (*string, error) {
	key := "reset_engine"
	url := config.AppConfig.ElasticWebService[key]
	if url == "" {
		return nil, fmt.Errorf("URL Not found")
	}

	client := http.DefaultClient
	client.Timeout = 5 * time.Second

	req := httpRequest(client.Transport)

	client.Transport = req

	log.Debugf("Executing http POST to [%s]", url)
	response, err := client.Post(url, "application/json", bytes.NewBuffer([]byte{}))
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		log.Errorf("HTTP API returned error: %d", response.StatusCode)
		return nil, fmt.Errorf("HTTP API returned error: %d", response.StatusCode)
	}

	data, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Errorf("Response error: %v", err)
		return nil, fmt.Errorf("Response error: %v", err)
	}

	var result string
	err = json.Unmarshal(data, &result)
	if err != nil {
		log.Errorf("Response format error: %v", err)
		return nil, fmt.Errorf("Response format error: %v", err)
	}
	return &result, nil
}
