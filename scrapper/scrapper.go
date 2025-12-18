package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/anaskhan96/soup"
)

const cpiJson = "./cpi.json"

func parseTable(html string) map[string][]string {
	yearReg, _ := regexp.Compile(`>(\d\d\d\d)<`)
	valueReg, _ := regexp.Compile(`([-]{0,1}\d+,\d)`)
	data := make(map[string][]string)
	year := ""

	doc := soup.HTMLParse(html)

	for _, tbody := range doc.FindAll("div", "id", "tabulka-4") {
		for _, tr := range tbody.FindAll("tr") {
			inside := tr.HTML()
			if yearReg.MatchString(inside) {
				m := yearReg.FindStringSubmatch(inside)
				year = m[1]
				// fmt.Println(year)
			}
			for _, td := range tr.FindAll("td") {
				inside := td.HTML()

				if valueReg.MatchString(inside) {
					m := valueReg.FindStringSubmatch(inside)
					value := strings.ReplaceAll(m[1], ",", ".")
					data[year] = append(data[year], value)
					// fmt.Println(value)
				}
			}
		}

	}

	return data

}

func checkErr(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

func readFile(filename string) string {
	bytes, err := ioutil.ReadFile(filename)
	checkErr(err)

	return string(bytes)
}

func fetchHtml(url string) string {
	resp, err := http.Get(url)
	checkErr(err)
	defer resp.Body.Close()

	html, err := ioutil.ReadAll(resp.Body)
	checkErr(err)

	return string(html)

}

func main() {
	html := fetchHtml("https://csu.gov.cz/mira_inflace")
	// for debugging
	// html := readFile("./cpi.html")
	data := parseTable(html)

	json, err := json.Marshal(data)
	checkErr(err)

	fileInfo, err := os.Stat(cpiJson)

	if errors.Is(err, os.ErrNotExist) || fileInfo.Size() < int64(len(json)) {
		err = ioutil.WriteFile(cpiJson, json, 0644)
		checkErr(err)
	}

}
