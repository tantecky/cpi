package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseTable(t *testing.T) {
	html := readFile("./cpi.html")
	data := parseTable(html, 4)

	assert.Equal(t, 12, len(data["1998"]), "they should be equal")
	assert.Equal(t, "0.3", data["1997"][1], "they should be equal")
	assert.Equal(t, "-0.1", data["2005"][2], "they should be equal")
}
