package helper

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"io"
)

func EncryptToken(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	ciphertext := make([]byte, aes.BlockSize+len(text))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return nil, err
	}
	cfb := cipher.NewCFBEncrypter(block, iv)
	cfb.XORKeyStream(ciphertext[aes.BlockSize:], text)
	return ciphertext, nil
}

func DecryptToken(key, text []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	if len(text) < aes.BlockSize {
		return nil, errors.New("ciphertext too short")
	}
	iv := text[:aes.BlockSize]
	text = text[aes.BlockSize:]
	cfb := cipher.NewCFBDecrypter(block, iv)
	cfb.XORKeyStream(text, text)
	return text, nil
}

// this MD5Hash is the duplication of previous one
func GetMD5Hash(text string) string {
	// Create an MD5 hash object
	hasher := md5.New()
	// Write the ASCII-encoded bytes of the input string to the hash object
	hasher.Write([]byte(text))
	// Get the hash sum
	hashBytes := hasher.Sum(nil)
	// Convert the hash bytes to a Base64-encoded string
	return base64.StdEncoding.EncodeToString(hashBytes)
}

// real-one MD5 Hash
// func GetMD5Hash(text string) string {
// 	hasher := md5.New()
// 	hasher.Write([]byte(text))
// 	hash := hex.EncodeToString(hasher.Sum(nil))
// 	return hash
// }
