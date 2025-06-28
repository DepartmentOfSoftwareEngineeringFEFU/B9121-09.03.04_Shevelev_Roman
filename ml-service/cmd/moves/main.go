package main

import (
	src "checkers/src"
	"fmt"
)

func main() {
	b := src.Board{}.
		Set(4, src.WhiteKing).
		Set(13, src.WhiteMan).
		Set(17, src.BlackKing).
		Turn(false)
	fmt.Printf("Starting position:\n%s\n", b)
	moves := b.AllMoves()
	for i, m := range moves {
		fmt.Printf("\n№%v %v\n%s\n", i+1, b.GenerateMoveName(m), m)
	}
}
