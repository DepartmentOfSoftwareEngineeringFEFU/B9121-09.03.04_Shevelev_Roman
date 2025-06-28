package main

import (
	_ "embed"
	"fmt"
	"os"
	"time"

	src "checkers/src"
)

func main() {
	b := src.Board{}.
		Set(src.Parse("a7"), src.X).
		Set(src.Parse("c5"), src.O).
		Set(src.Parse("e5"), src.X).
		Set(src.Parse("h2"), src.X)
	fmt.Printf("Starting position:\n%s\n", b)
	minimax(b)
}

func minimax(b src.Board) {
	var db src.EndgameDB
	var err error
	db, err = os.ReadFile("endgame.db")
	if err != nil {
		panic(err)
	}

	m := src.NewMinimax(src.Zero, 8, db)

	start := time.Now()
	best, rate, steps := m.BestMove(b, true)
	d := time.Since(start)

	fmt.Println(best)
	fmt.Printf("  best move: %v\n", b.GenerateMoveName(best))
	fmt.Printf("       rate: %v\n", rate)
	fmt.Printf("      steps: %v\n", steps)
	fmt.Printf("   duration: %.2f seconds\n", d.Seconds())
	fmt.Printf("  evaluated: %v\n", m.Evaluated)
	fmt.Printf("   cut offs: %v\n", m.CutOffs)
	fmt.Printf(" cache size: %v\n", len(m.Cache))
	fmt.Printf(" cache hits: %v\n", m.CacheHits)
	fmt.Printf("    db hits: %v\n", m.DBHits)
}
