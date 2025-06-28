const express = require("express");
const cors = require("cors");
const usersRouter = require("./routers/users");
const trainingRouter = require("./routers/training");
const authRouter = require("./routers/authRouter");
const problemsRouter = require("./routers/problemsRouter");
const problemRouter = require("./routers/problemRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/training", trainingRouter);
app.use("/auth", authRouter);
app.use("/problems", problemsRouter);
app.use("/problem", problemRouter);

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
