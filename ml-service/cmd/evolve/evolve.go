package main

import (
	src "checkers/src"
	"encoding/json"
	"fmt"
	"math/rand"
	"os"
	"path"
	"runtime"
	"sort"
	"sync"
	"text/tabwriter"
	"time"
)

const depth = 4
const defaultPopSize = 30
const groupSize = 10

func main() {
	var population []*src.Breed

	fileName := time.Now().Format("2006-01-02T15_04_05.json")

	if len(os.Args) > 1 {
		fileName = path.Base(os.Args[1])
		population = src.LoadPopulation(os.Args[1])
	} else {
		population = make([]*src.Breed, defaultPopSize)
		for i := range population {
			population[i] = src.CreateRandomBreed([]int{32, 40, 10, 1})
		}
	}

	for gen := 1; ; gen++ {
		println("# Generation", gen)

		groups := groupPopulation(population, groupSize)
		games := make([]game, 0)
		for _, group := range groups {
			for i := 0; i < len(group); i++ {
				for j := i + 1; j < len(group); j++ {
					games = append(games, game{group[i], group[j]})
					games = append(games, game{group[j], group[i]})
				}
			}
		}

		playGames(games)

		sort.Slice(population, func(i, j int) bool {
			return population[i].Score > population[j].Score
		})

		printStats(population)

		population = population[:len(population)/2]

		for i := range population {
			population[i].Age++
			population[i].ClearStats()
		}

		for _, breed := range population {
			population = append(population, breed.Mutate())
		}

		buf, err := json.Marshal(population)
		if err != nil {
			panic(err)
		}

		err = os.WriteFile("data/"+fileName, buf, 0644)
		if err != nil {
			panic(err)
		}
		fmt.Printf("Saved to %v\n", fileName)

		print("\n\n")
	}
}

func printStats(population []*src.Breed) {
	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	src.BreedTitle(w)

	long := population[0]
	best := population[0]
	unluckiest := population[len(population)/2]
	worst := population[len(population)-1]
	childrenCount := map[string]int{}
	for i, breed := range population {
		childrenCount[breed.Parent]++
		if i < len(population)/2 {
			if breed.Age > long.Age {
				long = breed
			}
		}
	}
	mostChildren := ""
	for _, breed := range population {
		if childrenCount[breed.Name] > childrenCount[mostChildren] {
			mostChildren = breed.Name
		}
	}
	best.Print(w, "Best Score")
	long.Print(w, "Longest Survivor")
	unluckiest.Print(w, "Unluckiest")
	worst.Print(w, "Worst Score")
	_ = w.Flush()

	println()
	draws := 0
	total := 0
	for _, breed := range population {
		total += breed.Wins + breed.Draws + breed.Losses
		draws += breed.Draws
	}
	total /= 2
	fmt.Printf("Draws: %v%%\n", draws*100/total)
	if mostChildren != "" {
		fmt.Printf("Most children: %v (%v)\n", mostChildren, childrenCount[mostChildren])
	}
}

func playGames(games []game) {

	poolSize := runtime.NumCPU()
	gameChan := make(chan game, poolSize)
	var wg sync.WaitGroup

	for i := 0; i < poolSize; i++ {
		go worker(gameChan, &wg)
	}

	for i, g := range games {
		wg.Add(1)
		gameChan <- g
		src.ProgressBar(i+1, len(games), 50, "")
	}
	src.ClearProgressBar()

	close(gameChan)
	wg.Wait()
}

func worker(gameChan <-chan game, wg *sync.WaitGroup) {
	for g := range gameChan {
		g.play()
		wg.Done()
	}
}

type game struct {
	white *src.Breed
	black *src.Breed
}

func (g game) play() {
	playerOne := src.NewMinimax(g.white.Net, depth, nil)
	playerTwo := src.NewMinimax(g.black.Net, depth, nil)
	result := src.Play(src.NewBoard(), playerOne, playerTwo, false)

	g.white.Lock()
	defer g.white.Unlock()
	g.black.Lock()
	defer g.black.Unlock()

	switch result {
	case src.WhiteWins:
		g.white.Wins++
		g.white.Score += 1
		g.black.Losses++
		g.black.Score -= 2
	case src.BlackWins:
		g.white.Losses++
		g.white.Score -= 2
		g.black.Wins++
		g.black.Score += 1
	case src.Draw:
		g.white.Draws++
		g.black.Draws++
	}
}

func groupPopulation(population []*src.Breed, groupSize int) [][]*src.Breed {
	shufflePopulation(population)

	groupCount := (len(population) + groupSize - 1) / groupSize
	groups := make([][]*src.Breed, groupCount)

	for i := 0; i < groupCount; i++ {
		startIndex := i * groupSize
		endIndex := startIndex + groupSize
		if endIndex > len(population) {
			endIndex = len(population)
		}
		groups[i] = population[startIndex:endIndex]
	}

	return groups
}

func shufflePopulation(population []*src.Breed) {
	for i := len(population) - 1; i > 0; i-- {
		j := rand.Intn(i + 1)
		population[i], population[j] = population[j], population[i]
	}
}
