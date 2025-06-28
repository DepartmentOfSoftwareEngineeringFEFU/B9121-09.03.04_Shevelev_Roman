package main

import (
	src "checkers/src"
)

func main() {
	b := src.NewBoard()
	player1 := src.NewMinimax(src.Zero, 6, nil)
	player2 := src.NewMinimax(src.Zero, 6, nil)
	src.Play(b, player1, player2, true)
}
