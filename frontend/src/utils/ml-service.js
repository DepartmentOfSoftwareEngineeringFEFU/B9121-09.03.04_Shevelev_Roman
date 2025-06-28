export async function getBestMove(fen, depth = 8) {
  const res = await fetch("http://localhost:8081/best-move", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fen, depth }),
  });
  if (!res.ok) {
    throw new Error("Ошибка запроса к серверу минимакса");
  }
  return await res.json();
}
