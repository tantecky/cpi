package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"regexp"
	"strings"

	"github.com/anaskhan96/soup"
)

func parseTable(html string, tableNumber int) map[string][]string {
	yearReg, _ := regexp.Compile(`(\d\d\d\d)`)
	valueReg, _ := regexp.Compile(`([-]{0,1}\d+,\d)`)
	data := make(map[string][]string)
	year := ""
	tableIdx := 0

	doc := soup.HTMLParse(html)

	for _, tbody := range doc.FindAll("table", "class", "tabulka") {
		tableIdx++

		if tableIdx != tableNumber {
			continue
		}

		for _, tr := range tbody.FindAll("tr") {
			for _, td := range tr.FindAll("td") {
				inside := td.HTML()

				if yearReg.MatchString(inside) {
					m := yearReg.FindStringSubmatch(inside)
					year = m[1]
					// fmt.Println(year)
				} else if valueReg.MatchString(inside) {
					m := valueReg.FindStringSubmatch(inside)
					value := strings.ReplaceAll(m[1], ",", ".")
					data[year] = append(data[year], value)
					// fmt.Println(value)
				}

			}
		}

		return data
	}

	return nil

}

func readFile(filename string) string {
	bytes, err := ioutil.ReadFile(filename)

	if err != nil {
		log.Fatal(err)
	}

	return string(bytes)
}

func main() {
	html := readFile("./cpi.html")
	// parse table number 4
	data := parseTable(html, 4)

	json, err := json.Marshal(data)

	if err != nil {
		log.Fatal(err)
	}

	err = ioutil.WriteFile("./cpi.json", json, 0644)

	if err != nil {
		log.Fatal(err)
	}

}
