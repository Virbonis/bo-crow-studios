package main

import (
	"runtime/debug"

	"github.com/AxionHQ/tsubasa-admin/web"
)

// version will be set through ldflags, contains current version
var version = "undefined"

// channel can be set via ldflags
var channel = "release"

// GOARM value - set via ldflags
var goarm = ""

func main() {
	debug.SetGCPercent(10)
	web.Main(version, channel, goarm)
	// fmt.Println("connection_string_IS:", database.EncryptConnectionString("server=172.24.13.120; database=Inetsoccer; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_IPost:", database.EncryptConnectionString("server=172.24.13.120; database=Inetsoccer_Post; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_Log:", database.EncryptConnectionString("server=172.24.13.120; database=Inetsoccer_Log; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_IHist:", database.EncryptConnectionString("server=172.24.13.120; database=Inetsoccer_Hist; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_LogHist:", database.EncryptConnectionString("server=172.24.13.120; database=Inetsoccer_Log_Hist; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_Games:", database.EncryptConnectionString("server=172.24.13.120; database=MgmtGames; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_SUI:", database.EncryptConnectionString("server=172.24.13.120; database=SecureUserID; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_SB:", database.EncryptConnectionString("server=172.24.13.120; database=SoccerBot; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_GO:", database.EncryptConnectionString("server=172.24.13.120; database=GoldenOdds; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_RB:", database.EncryptConnectionString("server=172.24.13.120; database=RunningBall; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_BG:", database.EncryptConnectionString("server=172.24.13.120; database=BetGenius; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_BBZ:", database.EncryptConnectionString("server=172.24.13.120; database=BetBazar; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_RTS:", database.EncryptConnectionString("server=172.24.13.120; database=RTSFootball; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_IM:", database.EncryptConnectionString("server=172.24.13.120; database=IMSports; user id=admin.user; password=Adm1n.User"))
	// fmt.Println("connection_string_BTI:", database.EncryptConnectionString("server=172.24.13.120; database=BTiSports; user id=admin.user; password=Adm1n.User"))
}
