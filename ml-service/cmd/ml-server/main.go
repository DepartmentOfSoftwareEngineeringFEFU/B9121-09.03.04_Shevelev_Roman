package main

import (
	"checkers/src"
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

type BestMoveRequest struct {
	FEN   string `json:"fen"`
	Depth int    `json:"depth"`
}

type BestMoveResponse struct {
	Move   string  `json:"move"`
	NewFEN string  `json:"new_fen"`
	Score  float64 `json:"score"`
}

func ParseFEN(fen string) src.Board {

	parts := strings.Split(fen, ":")
	if len(parts) < 2 {
		return src.NewBoard()
	}
	turn := parts[0]
	board := src.Board{}
	for i := 1; i < len(parts); i++ {
		p := parts[i]
		if len(p) < 2 {
			continue
		}
		color := p[0]
		squares := strings.Split(p[1:], ",")
		for _, sq := range squares {
			if sq == "" {
				continue
			}
			isKing := false
			if strings.Contains(sq, "K") {
				isKing = true
				sq = strings.ReplaceAll(sq, "K", "")
			}
			pos := src.Parse(sq)
			var piece src.Piece
			if color == 'W' {
				if isKing {
					piece = src.WhiteKing
				} else {
					piece = src.WhiteMan
				}
			} else {
				if isKing {
					piece = src.BlackKing
				} else {
					piece = src.BlackMan
				}
			}
			board = board.Set(pos, piece)
		}
	}

	if turn == "B" {
		board = board.Turn(false)
	}
	return board
}

func BoardToFEN(b src.Board) string {

	turn := "W"
	if b.IsBlackTurn() {
		turn = "B"
	}
	var w, wk, b_, bk []string
	for i := 0; i < 32; i++ {
		p := b.Get(src.Pos(i))
		sq := src.PosString(src.Pos(i))
		switch p {
		case src.WhiteMan:
			w = append(w, sq)
		case src.WhiteKing:
			wk = append(wk, sq+"K")
		case src.BlackMan:
			b_ = append(b_, sq)
		case src.BlackKing:
			bk = append(bk, sq+"K")
		}
	}
	var fen strings.Builder
	fen.WriteString(turn + ":")
	if len(w) > 0 {
		fen.WriteString("W" + strings.Join(w, ","))
	}
	if len(wk) > 0 {
		if len(w) > 0 {
			fen.WriteString(",")
		}
		fen.WriteString(strings.Join(wk, ","))
	}
	if len(b_) > 0 || len(bk) > 0 {
		fen.WriteString(":")
	}
	if len(b_) > 0 {
		fen.WriteString("B" + strings.Join(b_, ","))
	}
	if len(bk) > 0 {
		if len(b_) > 0 {
			fen.WriteString(",")
		}
		fen.WriteString(strings.Join(bk, ","))
	}
	return fen.String()
}

func bestMoveHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var req BestMoveRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request", http.StatusBadRequest)
		return
	}
	board := ParseFEN(req.FEN)
	net := src.Zero
	depth := req.Depth
	if depth <= 0 {
		depth = 8
	}
	minimax := src.NewMinimax(net, depth, nil)
	move, score, _ := minimax.BestMove(board, false)
	moveName := board.GenerateMoveName(move)
	newFEN := BoardToFEN(move)
	resp := BestMoveResponse{
		Move:   moveName,
		NewFEN: newFEN,
		Score:  score,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func main() {
	http.HandleFunc("/best-move", bestMoveHandler)
	log.Println("Сервер запущен на порту :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
