import React from "react";
import CheckersBoard from "../CheckersBoard";
import { parseFen } from "../../utils/checkersUtils";

const BoardViewer = ({ fen }) => {
  const boardState = parseFen(fen);
  return (
    <div>
      <CheckersBoard pieces={boardState.pieces} />
    </div>
  );
};

export default BoardViewer;
