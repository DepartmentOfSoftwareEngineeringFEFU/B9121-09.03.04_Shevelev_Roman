# Checkers Trainer

Приложение для обучения игре в шашки, включающее в себя систему уроков, задач и тренажеров.

## Требования

- Node.js (версия 14 или выше)
- MySQL (версия 8.0 или выше)
- Go (версия 1.18 или выше) - для ML сервиса
- npm или yarn

## Установка и запуск

### 1. Настройка базы данных

#### Способ 1: Установка MySQL Server

1. Установите MySQL Server:
   - **Windows**: Скачайте с [mysql.com](https://dev.mysql.com/downloads/mysql/)
   - **macOS**: `brew install mysql`
   - **Ubuntu/Debian**: `sudo apt install mysql-server`
   - **CentOS/RHEL**: `sudo yum install mysql-server`

2. Запустите MySQL сервис:
   - **Windows**: MySQL автоматически запускается как служба
   - **macOS**: `brew services start mysql`
   - **Linux**: `sudo systemctl start mysql`

3. Создайте базу данных:
   ```sql
   mysql -u root -p
   ```
4. В MySQL выполните:
   ```sql
   source /путь/к/файлу/checkers_trainer.sql
   ```

#### Способ 2: Docker

1. Установите Docker с [docker.com](https://www.docker.com/)

2. Запустите MySQL в контейнере:
   ```bash
   docker run --name checkers-mysql \
     -e MYSQL_ROOT_PASSWORD=your_password \
     -e MYSQL_DATABASE=checkers_trainer \
     -p 3306:3306 \
     -d mysql:8.0
   ```

3. Импортируйте схему базы данных:
   ```bash
   docker exec -i checkers-mysql mysql -uroot -pyour_password checkers_trainer < database/checkers_trainer.sql
   ```

#### Настройка подключения

После создания базы данных обновите конфигурацию в `backend/config/db.js`:

```javascript
module.exports = {
  host: 'localhost', // или IP вашего сервера
  user: 'root',      // или созданный пользователь
  password: 'your_password',
  database: 'checkers_trainer',
  port: 3306
};
```

#### Проверка подключения к базе данных

1. **Через командную строку:**
   ```bash
   mysql -u root -p -h localhost -P 3306 checkers_trainer
   ```

2. **Через бэкенд (после запуска):**
   - Запустите бэкенд: `cd backend && npm run dev`
   - Проверьте логи - должно появиться сообщение о подключении к БД

3. **Проверка таблиц:**
   ```sql
   USE checkers_trainer;
   SHOW TABLES;
   ```

   Должны быть таблицы: `users`, `lessons`, `problems`, `games`, `achievements` и др.

### 2. Настройка бэкенда

1. Перейдите в директорию бэкенда:
   ```bash
   cd backend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите сервер в режиме разработки:
   ```bash
   npm run dev
   ```
   Или в production режиме:
   ```bash
   npm start
   ```

### 3. Настройка фронтенда

1. Перейдите в директорию фронтенда:
   ```bash
   cd frontend
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите приложение:
   ```bash
   npm start
   ```

### 4. Настройка ML сервиса

ML сервис предоставляет API для расчета лучших ходов в шашках с использованием алгоритма минимакс и нейронной сети.

#### Требования для ML сервиса:
- Go (версия 1.18 или выше)
- Доступ к порту 8081

#### Установка и запуск:

1. Перейдите в директорию ML сервиса:
   ```bash
   cd ml-service
   ```

2. Убедитесь, что Go установлен и настроен:
   ```bash
   go version
   ```

3. Запустите ML сервер:
   ```bash
   cd cmd/ml-server
   go run main.go
   ```

4. Сервер запустится на порту 8081 и будет доступен по адресу `http://localhost:8081`

#### API эндпоинты ML сервиса:

- `POST /best-move` - получение лучшего хода
  - Тело запроса: `{"fen": "W:W1,2,3:B21,22,23", "depth": 8}`
  - Ответ: `{"move": "1-5", "new_fen": "B:W5,2,3:B21,22,23", "score": 0.5}`

#### Структура ML сервиса:

- `cmd/ml-server/` - основной сервер API
- `src/` - исходный код алгоритмов
  - `net.go` - нейронная сеть для оценки позиций
  - `minimax.go` - алгоритм минимакс
  - `board.go` - логика доски и ходов
  - `breed.go` - эволюционные алгоритмы
- `assets/` - предобученные модели
- `db/` - базы данных эндшпилей

#### Дополнительные команды ML сервиса:

- `cmd/evolve/` - эволюционное обучение нейронных сетей
- `cmd/compare/` - сравнение различных игроков
- `cmd/play/` - игра между ИИ
- `cmd/minimax/` - анализ позиций с минимаксом

#### Проверка работоспособности ML сервиса:

После запуска ML сервера вы можете проверить его работу, отправив тестовый запрос:

```bash
curl -X POST http://localhost:8081/best-move \
  -H "Content-Type: application/json" \
  -d '{"fen": "W:W1,2,3:B21,22,23", "depth": 4}'
```

Ожидаемый ответ:
```json
{
  "move": "1-5",
  "new_fen": "B:W5,2,3:B21,22,23",
  "score": 0.123
}
```

### Полный порядок запуска системы

Для полной работы приложения необходимо запустить все компоненты в следующем порядке:

1. **База данных MySQL** - убедитесь, что MySQL запущен и база данных создана
2. **ML сервис** - запустите ML сервер для анализа позиций
3. **Бэкенд** - запустите Node.js сервер для API
4. **Фронтенд** - запустите React приложение

#### Команды для быстрого запуска (в разных терминалах):

**Терминал 1 - ML сервис:**
```bash
cd ml-service/cmd/ml-server
go run main.go
```

**Терминал 2 - Бэкенд:**
```bash
cd backend
npm run dev
```

**Терминал 3 - Фронтенд:**
```bash
cd frontend
npm start
```

После этого приложение будет доступно по адресу `http://localhost:3000`, а ML сервис по адресу `http://localhost:8081`.

## Структура проекта

- `backend/` - серверная часть приложения
  - `controllers/` - контроллеры для обработки запросов
  - `routers/` - маршруты API
  - `models/` - модели данных
  - `middleware/` - промежуточное ПО
  - `config/` - конфигурационные файлы

- `frontend/` - клиентская часть приложения
  - `src/` - исходный код React-приложения
  - `public/` - статические файлы

- `ml-service/` - сервис машинного обучения
  - `cmd/` - исполняемые команды
    - `ml-server/` - основной API сервер
    - `evolve/` - эволюционное обучение
    - `compare/` - сравнение игроков
    - `play/` - игра между ИИ
    - `minimax/` - анализ позиций
  - `src/` - исходный код алгоритмов
    - `net.go` - нейронная сеть
    - `minimax.go` - алгоритм минимакс
    - `board.go` - логика доски
    - `breed.go` - эволюционные алгоритмы
  - `assets/` - предобученные модели
  - `db/` - базы данных эндшпилей

- `database/` - файлы базы данных
  - `checkers_trainer.sql` - дамп базы данных

## Используемые технологии

### Бэкенд
- Node.js
- Express.js
- MySQL
- JWT для аутентификации
- bcrypt для хеширования паролей

### Фронтенд
- React
- Material-UI
- React Router
- Framer Motion
- Styled Components
- React Hot Toast

### ML сервис
- Go
- Алгоритм минимакс для поиска лучших ходов
- Нейронная сеть для оценки позиций
- Эволюционные алгоритмы для обучения
- HTTP API для интеграции с фронтендом

## API Endpoints

Бэкенд предоставляет следующие основные эндпоинты:
- `/api/auth` - аутентификация
- `/api/users` - управление пользователями
- `/api/lessons` - уроки
- `/api/problems` - задачи
- `/api/trainers` - тренажеры
- `/api/achievements` - достижения

## Лицензия

MIT
