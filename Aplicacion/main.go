package main

import (
	"fmt"
	"log"
	"net/http"
	"github.com/googollee/go-socket.io"
	"io/ioutil"
	"strings"
	"strconv"
)

func main() {

	leerCpu()
	server, err := socketio.NewServer(nil)
	if err != nil {
		log.Fatal(err)
	}
	server.OnConnect("/", func(s socketio.Conn) error {
		s.SetContext("")
		s.Join("sala")
		fmt.Println("connected:", s.ID())
		return nil
	})
	server.OnEvent("/", "notice", func(s socketio.Conn, msg string) {
		fmt.Println("notice:", msg)
		s.Emit("reply", "have "+msg)
	})
	server.OnEvent("/chat", "msg", func(s socketio.Conn, msg string) string {
		s.SetContext(msg)
		return "recv " + msg
	})
	server.OnEvent("/", "getdatos", func(s socketio.Conn, msg string) string {
		//log.Println(msg)
		//rarchivos()
		st1 := leerCpu()
		st2 := leerRam()
		st3 := fmt.Sprintf("{ %s %s }" , st1 , st2)
		s.Emit("datos", st3)
		return st3
	})
	
	server.OnEvent("/", "bye", func(s socketio.Conn) string {
		last := s.Context().(string)
		s.Emit("bye", last)
		s.Close()
		return last
	})
	server.OnError("/", func(s socketio.Conn, e error) {
		fmt.Println("meet error:", e)
	})
	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		fmt.Println("closed", reason)
	})
	go server.Serve()
	defer server.Close()

	http.Handle("/socket.io/", server)
	http.Handle("/", http.FileServer(http.Dir("./asset")))
	log.Println("Serving at localhost:8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))


}

func rarchivos() {
    archivos, err := ioutil.ReadDir("/proc")
    if err != nil {
        log.Fatal(err)
    }
    for _, archivo := range archivos {
        fmt.Println("Nombre:", archivo.Name())
        fmt.Println("Tamaño:", archivo.Size())
        fmt.Println("Modo:", archivo.Mode())
        fmt.Println("Ultima modificación:", archivo.ModTime())
        fmt.Println("Es directorio?:", archivo.IsDir())
        fmt.Println("-----------------------------------------")
    }
}

func leerCpu() string{
	nombreArchivo := "/proc/stat"
	bytesLeidos, err := ioutil.ReadFile(nombreArchivo)
	if err != nil {
		fmt.Printf("Error leyendo archivo: %v", err)
	}
	contenido := string(bytesLeidos)
	
	split := strings.Split(contenido, "\n")

	split2 := strings.Split(split[0] , " ")

	/*fmt.Println(split[0])
	fmt.Println("1-" + split2[2])
	fmt.Println("2-" + split2[4])
	fmt.Println("3-" + split2[5])

	fmt.Println("......")*/
	s2 , err := strconv.ParseFloat(split2[2],64)
	s4 , err := strconv.ParseFloat(split2[4],64)
	s5 , err := strconv.ParseFloat(split2[5],64)

	res := (s2 + s4)*100/(s2+s4+s5)

	res2 := fmt.Sprintf("\"cpu\": %f," , res)
	
	fmt.Println(res2)

	return res2
}

func leerRam() string{
	nombreArchivo := "/proc/meminfo"
	bytesLeidos, err := ioutil.ReadFile(nombreArchivo)
	if err != nil {
		fmt.Printf("Error leyendo archivo: %v", err)
	}

	mtotal := 0
	mfree := 0
	mdisp := 0

	contenido := string(bytesLeidos)
	//fmt.Printf("El contenido del archivo es: %s", contenido)
	split := strings.Split(contenido, "\n")
	for i := 0; i < len(split); i++ {
		split2 := strings.Split(split[i], ":")
		//fmt.Printf("--%s--\n", split2[0])
		if split2[0] == "MemTotal" {
			split2[1] = strings.Replace(split2[1], "kB", "",-1)
			split2[1] = strings.Replace(split2[1], " ", "",-1)
			mtotal , err = strconv.Atoi(split2[1])
		} else if split2[0] == "MemFree" {
			split2[1] = strings.Replace(split2[1], "kB", "",-1)
			split2[1] = strings.Replace(split2[1], " ", "",-1)
			mfree , err = strconv.Atoi(split2[1])
		} else if split2[0] == "MemAvailable" {
			split2[1] = strings.Replace(split2[1], "kB", "",-1)
			split2[1] = strings.Replace(split2[1], " ", "",-1)
			mdisp , err = strconv.Atoi(split2[1])
		} 
	}

	//ret := "{\"memtotal:" + mtotal + ",memfree:" + mfree + ",memavailible:" + mdisp + "}"

	ret := fmt.Sprintf("\"memtotal\":%d, \"memfree\": %d,\"memavailible\": %d " , mtotal , mfree , mdisp)

	fmt.Println(ret)
 
	return ret
}