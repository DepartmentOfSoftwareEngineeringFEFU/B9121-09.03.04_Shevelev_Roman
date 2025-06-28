package main

import (
	"fmt"
	"os"
	"strconv"

	src "checkers/src"
)

func main() {
	tier, err := strconv.Atoi(os.Args[1])
	if err != nil {
		panic(err)
	}

	eg := src.CreateEndgameList(tier)

	m := &src.EndgameMinimax{
		Cache: make(map[src.Board]src.Score),
	}

	for i, b := range eg.List {
		fmt.Printf("\n%v\n", b)
		m.ClearStats()
		rate, steps := m.Minimax(b)
		eg.Map[b] = &src.Score{Rate: rate, Steps: steps}
		if rate == 1 {
			fmt.Printf("%v moves and white wins in %v steps\n", b.TurnString(), steps)
		} else if rate == -1 {
			fmt.Printf("%v moves and black wins in %v steps\n", b.TurnString(), steps)
		} else {
			fmt.Printf("%v moves and draw in %v steps\n", b.TurnString(), steps)
		}
		fmt.Printf("%02d%% %v/%v cache:%v cache_hits:%v\n", 100*(i+1)/len(eg.List), i+1, len(eg.List), len(m.Cache), m.CacheHits)
		if len(m.Cache) > 100_000_000 {
			fmt.Printf("\ncache too big, clearing\n")
			m.Cache = make(map[src.Board]src.Score)
		}
	}

	filename := fmt.Sprintf("endgame_%v.db", tier)
	file, err := os.Create(filename)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	err = eg.Save(file)
	if err != nil {
		panic(err)
	}
	fmt.Printf("saved to %v\n", filename)
}
