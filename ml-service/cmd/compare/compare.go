package main

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"runtime"
	"strconv"
	"strings"
	"sync"

	src "checkers/src"
)

var player1 = src.Zero
var player2 = src.Zero

func main() {
	if len(os.Args) != 3 {
		fmt.Printf("Usage: %v <player1> <player2>\n", os.Args[0])
		return
	}
	player1 = loadPlayer(os.Args[1])
	player2 = loadPlayer(os.Args[2])

	b := src.NewBoard()
	boards := []src.Board{
		b,
		{U: 9223394075501583213, V: 160842835429380},
		{U: 9223374834635299693, V: 160842306961412},
		{U: 9223547964850887533, V: 160842842767620},
		{U: 9223394075501583213, V: 160842835314692},
	}
	for _, x := range b.AllMoves() {
		boards = append(boards, x.AllMoves()...)
	}

	inputCh := make(chan src.Board)
	workCh := make(chan src.Board)
	outputCh := make(chan [2]src.Status)
	done := make(chan bool)

	var wg sync.WaitGroup
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go scheduler(ctx, inputCh, workCh)
	for i := 0; i < runtime.NumCPU(); i++ {
		go worker(ctx, workCh, outputCh)
	}

	for _, b := range boards {
		wg.Add(1)
		inputCh <- b
	}

	go func() {
		wg.Wait()
		done <- true
	}()

	wins1 := 0
	wins2 := 0
	draws := 0
	i := 0
	for {
		select {
		case <-done:
			return
		case s := <-outputCh:
			for _, status := range s {
				if status == src.WhiteWins {
					wins1++
				} else if status == src.BlackWins {
					wins2++
				} else {
					draws++
				}
			}
			i++
			src.ProgressBar(i, len(boards), 50, fmt.Sprintf("(%v, %v, %v)", wins1, wins2, draws))
			wg.Done()
		}
	}
}

func worker(ctx context.Context, work chan src.Board, output chan [2]src.Status) {
	p1 := src.NewMinimax(player1, 4, nil)
	p2 := src.NewMinimax(player2, 4, nil)
	for {
		select {
		case <-ctx.Done():
			return
		case b := <-work:
			s1 := src.Play(b, p1, p2, false)
			s2 := src.Play(b, p2, p1, false)

			output <- [2]src.Status{s1, -s2}
		}
	}
}

func scheduler(ctx context.Context, input chan src.Board, work chan src.Board) {
	var queue []src.Board
	for {
		if len(queue) == 0 {
			select {
			case <-ctx.Done():
				return
			case i := <-input:
				queue = append(queue, i)
			}
		} else {
			select {
			case <-ctx.Done():
				return
			case i := <-input:
				queue = append(queue, i)
			case work <- queue[0]:
				queue = queue[1:]
			}
		}
	}
}

func loadPlayer(name string) *src.Network {
	switch name {
	case "zero":
		return src.Zero
	case "hei":
		return src.HeiOay
	case "random":
		return src.GenerateRandomNetwork([]int{32, 40, 10, 1})
	}
	parts := strings.Split(os.Args[2], ":")
	if len(parts) != 2 {
		panic("Expected <player.json>:<index>")
	}
	index, err := strconv.Atoi(parts[1])
	if err != nil {
		panic(err)
	}
	return src.LoadPopulation(parts[0])[index].Net
}
