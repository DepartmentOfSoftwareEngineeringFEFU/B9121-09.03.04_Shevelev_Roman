-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               8.0.35 - MySQL Community Server - GPL
-- Операционная система:         Win64
-- HeidiSQL Версия:              12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Дамп структуры базы данных checkers_trainer
CREATE DATABASE IF NOT EXISTS `checkers_trainer` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `checkers_trainer`;

-- Дамп структуры для таблица checkers_trainer.achievements
CREATE TABLE IF NOT EXISTS `achievements` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `Clause` text,
  `RewardType` enum('Points','Badge','Content') NOT NULL,
  `RewardValue` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.achievements: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.games
CREATE TABLE IF NOT EXISTS `games` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Date` datetime NOT NULL,
  `UserID` int NOT NULL,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Easy',
  `Result` enum('Win','Loss','Draw') NOT NULL,
  `Moves` text,
  PRIMARY KEY (`ID`),
  KEY `Player1ID` (`UserID`) USING BTREE,
  CONSTRAINT `games_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.games: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.group_members
CREATE TABLE IF NOT EXISTS `group_members` (
  `GroupID` int NOT NULL,
  `UserID` int NOT NULL,
  `JoinedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`GroupID`,`UserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `study_groups` (`ID`),
  CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.group_members: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.lessons
CREATE TABLE IF NOT EXISTS `lessons` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Topic` enum('Opening','Middlegame','Endgame','Combinations') NOT NULL,
  `Description` text,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Easy',
  `Material` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.lessons: ~5 rows (приблизительно)
INSERT INTO `lessons` (`ID`, `Title`, `Topic`, `Description`, `Difficulty`, `Material`) VALUES
	(1, 'Основы игры: Как ходят и бьют шашки', 'Opening', 'Изучите основные правила перемещения и взятия шашек в русских шашках.', 'Easy', 'Приветствуем в первом уроке!\n\nШашки ходят по диагонали вперед на одну клетку по черным полям. Бить можно и вперед, и назад, перепрыгивая через шашку соперника. Взятие шашки является обязательным, и если есть несколько вариантов взятия, игрок может выбрать любой из них. При возможности нескольких последовательных взятий за один ход, их все необходимо выполнить. Ход заканчивается только после завершения всех возможных взятий.\n\n[BOARD FEN="W:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12"]\n\nТеперь давайте посмотрим на простой пример взятия:\n\n[MOVES FEN="W:W23,28:B19" MOVES="19-24,28x19"]\n\nВзятие шашки является обязательным, и если есть несколько вариантов взятия, игрок может выбрать любой из них.\n\nПопробуйте решить простую задачу на взятие:\n\n[PROBLEM ID=1]'),
	(2, 'Как стать дамкой', 'Endgame', 'Узнайте, как простая шашка превращается в дамку, достигнув противоположного края доски, и какие преимущества это дает.', 'Easy', 'Добро пожаловать во второй урок!\n\nКогда ваша простая шашка достигает восьмого ряда (для белых — поля 1–4, для черных — поля 29–32), она становится дамкой. Дамка обозначается двойным символом или переворачивается.\n\nДамка ходит по диагонали на любое количество свободных полей как вперед, так и назад. Она также может брать шашки соперника, перепрыгивая через них, и останавливаться на любом свободном поле после последнего взятия. Взятие дамкой, как и простой шашкой, обязательно.\n\n[BOARD FEN="W:WK5:B16,20"]\n\nДавайте рассмотрим пример хода дамки:\n\n[MOVES FEN="W:WK5:B16" MOVES="5-23"]\n\nТеперь пример взятия дамкой:\n\n[MOVES FEN="W:WK23:B12" MOVES="12-16,23x12"]\n\nПопробуйте решить задачу, чтобы закрепить знания:\n\n[PROBLEM ID=2]'),
	(3, 'Первые ходы: Начальные принципы', 'Opening', 'Поймите важность первых ходов, контроля центра и развития фигур в начале партии.', 'Easy', 'Начало игры в шашках (дебют) имеет большое значение для дальнейшего хода партии. Ваша цель в дебюте - развить свои шашки, занять выгодные позиции и не допустить быстрого преимущества соперника.\n\nНекоторые важные принципы:\n- Занимайте центр доски: Шашки в центре имеют больше возможностей для хода и взятия.\n- Развивайте фланги: Не забывайте про шашки по краям доски, они тоже могут участвовать в атаке и защите.\n- Избегайте слабых позиций: Старайтесь не создавать изолированные шашки или уязвимые группы шашек.\n\nПример 1: Занятие центра\nОписание: Рассмотрим типичную позицию в дебюте, где белые делают ход в центр.\n\n[MOVES FEN="W:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12" MOVES="23-19,10-14"]\nПояснение: Белые ходят 23-19, занимая центральную позицию. Черные отвечают 10-14, также стремясь к центру.\n\nПример 2: Развитие фланга\nОписание: В этой позиции показано развитие правого фланга.\n\n[MOVES FEN="W:W21,22,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,10,11,12" MOVES="27-23,5-9"]\nПояснение: Белые развивают правый фланг ходом 27-23. Черные отвечают 5-9, укрепляя свой левый фланг.\n\nПример 3: Борьба за центр\n\n[MOVES FEN="W:W21,22,23,26,27,28,29,30,31,32:B2,3,4,5,6,7,8,9,10,11,12" MOVES="27-24,11-15"]\nПояснение: Черные усиливают контроль над центром 11-15, пытаясь противодействовать.\n\nПример 4: Взаимодействие шашек\nОписание: Важно, чтобы ваши шашки поддерживали друг друга.\n\n[MOVES FEN="W:W21,23,24,25,27,28,29,30,31,32:B1,2,3,4,6,7,8,10,11,12" MOVES="24-20,12-16"]\nПояснение: Белые создают связку ходом 24-20. Черные отвечают 12-16, готовясь к активным действиям.\n\nПример 5: Простое взятие\nОписание: Иногда соперник допускает ошибку, позволяющую простое взятие.\n\n[MOVES FEN="W:W21,22,23,24,25,26,27,28,29,30,31:B1,2,3,4,5,6,7,8,9,14,11" MOVES="14-18,22x15,11x18,23x14,9x18,26-23"]\nПояснение: Черные ошибочно ходят 14-18, и белые немедленно используют возможность взятия 22x15.\nПосле череды разменов черные окажутся в минусе на одну шашку, так как черная шашка остается без защиты.\n\nПример 6: Тактическая позиция\nОписание: В этой позиции показано, как правильно использовать дамку в центре.\n\n[MOVES FEN="W:WK17,21,24,25,27,28,29,30:B1,4,5,6,8,9" MOVES="17-26,9-13"]\nПояснение: Белая дамка ходом 17-26 контролирует важную диагональ. Черные вынуждены защищаться 9-13.'),
	(4, 'Простые комбинации и обязательные взятия', 'Combinations', 'Научитесь видеть простые тактические удары и использовать правило обязательного взятия в свою пользу.', 'Easy', 'Правило обязательного взятия и тактические комбинации\n\nПравило обязательного взятия - это фундаментальный принцип в шашках, который часто используется для создания выгодных позиций. Если у игрока есть возможность взять шашку соперника, он обязан это сделать. Опытные игроки используют это правило для создания вынужденных позиций, которые приводят к преимуществу.\n\nОсновные принципы:\n- Всегда ищите возможности для взятия\n- Используйте правило обязательного взятия для создания выгодных позиций\n- Иногда жертва шашки может привести к выигрышной комбинации\n- Следите за ответными взятиями соперника\n\nПример 1: Простое обязательное взятие\nОписание: Базовая позиция, демонстрирующая правило обязательного взятия.\n\n[MOVES FEN="W:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12" MOVES="22-18,11-15,18x11,7x16"]\nПояснение: Белые ходят 22-18, создавая возможность взятия. Черные обязаны взять 11-15, после чего белые берут 18x11. Черные отвечают 7x16, завершая размен.\n\nПример 2: Жертва для создания выгодной позиции\nОписание: Позиция, где жертва шашки приводит к выгодному положению.\n\n[MOVES FEN="W:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12" MOVES="24-19,10-14,19-15,11x18,22x15,9-13,23-18,14x23,27x18"]\nПояснение: Белые жертвуют шашку 24-19, вынуждая черных взять 11x18. После серии обязательных взятий белые получают выгодную позицию в центре, контролируя важные поля.'),
	(5, 'Эндшпиль: Как поймать дамку', 'Endgame', 'Освойте базовые приемы для поимки дамки соперника в конце игры.', 'Easy', 'В эндшпиле (когда на доске осталось мало шашек) главной целью часто становится проведение своих шашек в дамки и использование их для выигрыша. Однако, дамка соперника может быть очень опасна.\n\nБазовый принцип поимки дамки - ограничить ее подвижность и загнать в угол или на край доски, где она имеет меньше ходов и может быть атакована вашими шашками или дамками.\n\nЧасто для поимки дамки используется взаимодействие нескольких своих шашек, которые перекрывают диагонали, по которым может ходить дамка соперника.\n\n- Ограничивайте подвижность дамки, перекрывая диагонали\n- Используйте взаимодействие своих шашек\n- Загоняйте дамку в угол или на край доски\n- Применяйте прием треугольника Петрова для поимки дамки\n\nТреугольник Петрова - это классический метод поимки дамки, разработанный русским мастером А.Д. Петровым. Метод основан на правильном расположении трех шашек, которые создают "треугольник", ограничивающий подвижность дамки соперника.\n\n[MOVES FEN="B:WK10,K22,K23:BK2" MOVES="2-20,10-17,20-2,23-9,2x13,22-31,13x22,31x13"]');

-- Дамп структуры для таблица checkers_trainer.problems
CREATE TABLE IF NOT EXISTS `problems` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `CategoryID` int DEFAULT NULL,
  `InitialPosition` text NOT NULL,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Easy',
  `Solution` text,
  `Hint` text,
  `HintType` enum('OneMove','MultipleMoves','FullSolution') DEFAULT NULL,
  `TimeLimit` int DEFAULT NULL COMMENT 'Время на решение в секундах',
  `Points` int DEFAULT '0' COMMENT 'Количество очков за решение',
  PRIMARY KEY (`ID`),
  KEY `problems_ibfk_2` (`CategoryID`),
  CONSTRAINT `problems_ibfk_2` FOREIGN KEY (`CategoryID`) REFERENCES `problem_categories` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.problems: ~50 rows (приблизительно)
INSERT INTO `problems` (`ID`, `Title`, `Description`, `CategoryID`, `InitialPosition`, `Difficulty`, `Solution`, `Hint`, `HintType`, `TimeLimit`, `Points`) VALUES
	(1, '', NULL, NULL, 'W:W20:B16', 'Easy', 'h4xf6', 'Обратите внимание на обязательное взятие.', 'OneMove', NULL, 0),
	(2, '', NULL, NULL, 'W:WK9:B27', 'Easy', 'b6xg1', 'Используйте дамку, чтобы взять шашку соперника.', 'OneMove', NULL, 0),
	(3, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK18', 'Easy', 'd4-c5|d4-b6|d4-a7|d4-e5|d4-f6|d4-g7|d4-h8|d4-c3|d4-b2|d4-a1|d4-e3|d4-f2|d4-g1', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(4, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK9', 'Easy', 'b6-a7|b6-c7|b6-d8|b6-a5|b6-c5|b6-d4|b6-e3|b6-f2|b6-g1', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(5, 'Ходы простых', 'Начальные шаги', 1, 'W:W22', 'Easy', 'c3-d4|c3-b4', 'Сделайте ход', 'OneMove', NULL, 0),
	(6, 'Ходы простых', 'Начальные шаги', 1, 'W:W28', 'Easy', 'h2-g3', 'Сделайте ход', 'OneMove', NULL, 0),
	(7, 'Становление дамкой', 'Начальные шаги', 1, 'W:W8', 'Easy', 'g7-h8|g7-f8', 'Сделайте ход', 'OneMove', NULL, 0),
	(8, 'Ходы простых', 'Начальные шаги', 1, 'W:W5', 'Easy', 'a7-b8', 'Сделайте ход', 'OneMove', NULL, 0),
	(9, 'Ходы простых', 'Начальные шаги', 1, 'W:W10', 'Easy', 'd6-c7|d6-e7', 'Сделайте ход', 'OneMove', NULL, 0),
	(10, 'Ходы простых', 'Начальные шаги', 1, 'W:W29', 'Easy', 'a1-b2', 'Сделайте ход', 'OneMove', NULL, 0),
	(11, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK1', 'Easy', 'b8-a7|b8-c7|b8-d6|b8-e5|b8-f4|b8-g3|b8-h2', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(12, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK26', 'Easy', 'd2-c3|d2-b4|d2-a5|d2-e3|d2-f4|d2-g5|d2-h6|d2-c1|d2-e1', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(13, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK3', 'Easy', 'f8-e7|f8-d6|f8-c5|f8-b4|f8-a3|f8-g7|f8-h6', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(14, 'Ходы дамок', 'Дамка может ходить вперёд и назад на много клеток', 2, 'W:WK15', 'Easy', 'e5-d6|e5-c7|e5-b8|e5-f6|e5-g7|e5-h8|e5-d4|e5-c3|e5-b2|e5-a1|e5-f4|e5-g3|e5-f2|e5-g1', 'Дамка может ходить вперёд и назад на много клеток', 'OneMove', NULL, 0),
	(15, 'Выбор боя', 'Как рубят простые', 3, 'W:W14:B9,10,17,18', 'Easy', 'c5xa7|c5xe7|c5xa3|c5xe3', 'Срубите шашку в любом направлении', 'OneMove', NULL, 0),
	(16, 'Руби пока можешь!', 'Как рубят простые', 3, 'W:W32:B28,27,18,9', 'Easy', 'g1xe3,e3xc5,c5xa7', 'Срубите 3 шашки противника', 'MultipleMoves', NULL, 0),
	(17, 'Простая рубит', 'Как рубят простые', 3, 'W:W20:B24,16,11', 'Easy', 'h4xf2', 'Простая шашка умеет рубить назад', 'OneMove', NULL, 0),
	(18, 'Простая рубит', 'Как рубят простые', 3, 'W:W21:B25,7', 'Easy', 'a3xc1', 'Простая шашка умеет рубить назад', 'OneMove', NULL, 0),
	(19, 'Простая рубит', 'Как рубят простые', 3, 'W:W31:B26,17,24', 'Easy', 'e1xc3,c3xa5', 'Срубите 2 шашки противника', 'MultipleMoves', NULL, 0),
	(20, 'Простая рубит до конца', 'Как рубят простые', 3, 'W:W20:B16,7,9', 'Easy', 'h4xf6,f6xd8,d8xa5', 'Простая рубит 2 шашки, становится дамкой и рубит дальше на правах дамки', 'MultipleMoves', NULL, 0),
	(21, 'Дамка рубит', 'Как рубит дамка', 4, 'W:WK13:B6', 'Easy', 'a5xd8', 'Дамка рубит шашку', 'OneMove', NULL, 0),
	(22, 'Дамка рубит', 'Как рубит дамка', 4, 'W:WK4:B22', 'Easy', 'h8xb2|h8xa1', 'Дамка рубит шашку двумя способами', 'MultipleMoves', NULL, 0),
	(23, 'Дамка рубит', 'Как рубит дамка', 4, 'W:WK20:B27,11,7', 'Easy', 'h4xe1', 'Дамка рубит шашку', 'OneMove', NULL, 0),
	(24, 'Дамка рубит несколько', 'Как рубит дамка', 4, 'W:WK5:B2,9,10', 'Easy', 'a7xc5,c5xf8', 'Дамка рубит несколько шашек', 'MultipleMoves', NULL, 0),
	(25, 'Дамка рубит несколько', 'Как рубит дамка', 4, 'W:WK32:B23,14,6', 'Easy', 'g1xd4,d4xb6,b6xd8', 'Дамка рубит несколько шашек', 'MultipleMoves', NULL, 0),
	(26, 'Дамка рубит несколько', 'Как рубит дамка', 4, 'W:WK31:BK19,9,17', 'Easy', 'e1xa5,a5xc7,c7xg3|e1xa5,a5xc7,c7xh2', 'Срубите все шашки противника', 'MultipleMoves', NULL, 0),
	(27, 'Тихий ход', 'Становление дамкой', 5, 'W:W5:B10', 'Easy', 'a7-b8', 'Простая становится дамкой с тихого хода, поэтому сразу рубить она не может', 'OneMove', NULL, 0),
	(28, 'Ход со взятием', 'Рубит на правах дамки', 5, 'W:W12:B8,10', 'Easy', 'h6xf8,f8xc5|h6xf8,f8xb4|h6xf8,f8xa3', 'Простая стала дамкой после того как срубила, поэтому рубит дальше на правах дамки', 'MultipleMoves', NULL, 0),
	(29, 'Тихий ход', 'Становление дамкой', 5, 'W:W8:B25', 'Easy', 'g7-f8|g7-h8', 'Простая становится дамкой с тихого хода, поэтому сразу рубить она не может', 'OneMove', NULL, 0),
	(30, 'Ход со взятием', 'Рубит на правах дамки', 5, 'W:W18,23:B6,14,16', 'Easy', 'd4xb6,b6xd8,d8xh4', 'Простая стала дамкой после того как срубила, поэтому рубит дальше на правах дамки', 'MultipleMoves', NULL, 0),
	(31, 'Ход со взятием', 'Рубит на правах дамки', 5, 'W:W28:B24,16,8,9,10', 'Easy', 'h2xf4,f4xh6,h6xf8,f8xc5,c5xa7', 'Простая стала дамкой после того как срубила, поэтому рубит дальше на правах дамки', 'MultipleMoves', NULL, 0),
	(32, 'Ход со взятием', 'Рубит на правах дамки', 5, 'W:W20:B16,8,18', 'Easy', 'h4xf6,f6xh8', 'Простая рубит 2 и не может срубить третью (d4), так как нельзя дважды перепрыгивать через срубленные шашки противника', 'MultipleMoves', NULL, 0),
	(33, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WK31:B17', 'Easy', 'e1xa5', 'Дамка рубит', 'OneMove', NULL, 0),
	(34, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WKc1:Bf4', 'Easy', 'c1xg5|c1xh6', 'Дамка рубит', 'OneMove', NULL, 0),
	(35, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WKb8:Bg3', 'Easy', 'b8xh2', 'Дамка рубит', 'OneMove', NULL, 0),
	(36, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WKh6:BKd2', 'Easy', 'h6xc1', 'Дамка рубит', 'OneMove', NULL, 0),
	(37, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WKg1:BKb6', 'Easy', 'g1xa7', 'Дамка рубит', 'OneMove', NULL, 0),
	(38, 'Рубим одну', 'Дальнобойность дамки', 6, 'W:WKh4:Be7', 'Easy', 'h4xd8', 'Дамка рубит', 'OneMove', NULL, 0),
	(39, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKf8:Bb4,b2', 'Easy', 'f8xa3,a3xc1', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(40, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKa7:BKg5,d4', 'Easy', 'a7xe3,e3xh6', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(41, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKg1:Be3,c7', 'Easy', 'g1xb6,b6xd8', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(42, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKh2:BKb4,f4', 'Easy', 'h2xd6,d6xa3', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(43, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKa1:Bc3,g5', 'Easy', 'a1xf6,f6xh4', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(44, 'Рубим две', 'Дальнобойность дамки', 7, 'W:WKe1:Bc3,c7', 'Easy', 'e1xa5,a5xd8', 'Дамка рубит две шашки противника', 'MultipleMoves', NULL, 0),
	(45, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKa5:Bf2,c7,Kf6', 'Easy', 'a5xd8,d8xh4,h4xe1', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0),
	(46, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKc1:BKc5,f4,g7', 'Easy', 'c1xh6,h6xf8,f8xa3|c1xh6,h6xf8,f8xb4', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0),
	(47, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKh4:Bg5,Ke5,c3', 'Easy', 'h4xf6,f6xd4,d4xb2|h4xf6,f6xd4,d4xa1', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0),
	(48, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKh6:Bb4,d4,f4', 'Easy', 'h6xe3,e3xc5,c5xa3', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0),
	(49, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKa3:BKd2,g7,e7', 'Easy', 'a3xf8,f8xh6,h6xc1', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0),
	(50, 'Рубим три', 'Дальнобойность дамки', 8, 'W:WKb8:Bd6,e3,c3', 'Easy', 'b8xf4,f4xd2,d2xb4|b8xf4,f4xd2,d2xa5', 'Дамка рубит три шашки противника', 'MultipleMoves', NULL, 0);

-- Дамп структуры для таблица checkers_trainer.problem_categories
CREATE TABLE IF NOT EXISTS `problem_categories` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `Description` text,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.problem_categories: ~8 rows (приблизительно)
INSERT INTO `problem_categories` (`ID`, `Name`, `Description`) VALUES
	(1, 'Ходы простых', 'Изучаем правила'),
	(2, 'Ходы дамок', 'Изучаем правила'),
	(3, 'Как рубят простые', 'Изучаем правила'),
	(4, 'Как рубят дамки', 'Изучаем правила'),
	(5, 'Простая стала дамкой. Рубим или нет?', 'Изучаем правила'),
	(6, 'Рубим одну', 'Дальнобойность дамки'),
	(7, 'Рубим две', 'Дальнобойность дамки'),
	(8, 'Рубим три', 'Дальнобойность дамки');

-- Дамп структуры для таблица checkers_trainer.study_groups
CREATE TABLE IF NOT EXISTS `study_groups` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `TrainerID` int NOT NULL,
  `Description` text,
  `CreatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  KEY `TrainerID` (`TrainerID`),
  CONSTRAINT `study_groups_ibfk_1` FOREIGN KEY (`TrainerID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.study_groups: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.userachievements
CREATE TABLE IF NOT EXISTS `userachievements` (
  `UserID` int NOT NULL,
  `AchievementID` int NOT NULL,
  `DateAchieved` datetime NOT NULL,
  PRIMARY KEY (`UserID`,`AchievementID`),
  KEY `AchievementID` (`AchievementID`),
  CONSTRAINT `userachievements_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  CONSTRAINT `userachievements_ibfk_2` FOREIGN KEY (`AchievementID`) REFERENCES `achievements` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.userachievements: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.userlessons
CREATE TABLE IF NOT EXISTS `userlessons` (
  `UserID` int NOT NULL,
  `LessonID` int NOT NULL,
  `Completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`UserID`,`LessonID`),
  KEY `LessonID` (`LessonID`),
  CONSTRAINT `userlessons_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  CONSTRAINT `userlessons_ibfk_2` FOREIGN KEY (`LessonID`) REFERENCES `lessons` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.userlessons: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.users
CREATE TABLE IF NOT EXISTS `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `Nickname` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Role` enum('User','PendingTrainer','Trainer') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'User',
  `Password` varchar(255) NOT NULL,
  `Rating` int DEFAULT '1200',
  `GamesPlayed` int DEFAULT '0',
  `Wins` int DEFAULT '0',
  `Losses` int DEFAULT '0',
  `Draws` int DEFAULT '0',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Nickname` (`Nickname`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.users: ~0 rows (приблизительно)

-- Дамп структуры для таблица checkers_trainer.user_problems
CREATE TABLE IF NOT EXISTS `user_problems` (
  `UserID` int NOT NULL,
  `ProblemID` int NOT NULL,
  `Completed` tinyint(1) DEFAULT '0',
  `Attempts` int DEFAULT '0',
  `LastAttempt` datetime DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
  `BestTime` int DEFAULT NULL COMMENT 'Лучшее время решения в секундах',
  `Score` int DEFAULT '0',
  PRIMARY KEY (`UserID`,`ProblemID`),
  KEY `ProblemID` (`ProblemID`),
  CONSTRAINT `user_problems_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  CONSTRAINT `user_problems_ibfk_2` FOREIGN KEY (`ProblemID`) REFERENCES `problems` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Дамп данных таблицы checkers_trainer.user_problems: ~0 rows (приблизительно)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
