import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const RulesContainer = styled(motion.div)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 15px;
  background-color: #f5f5dc;
  color: #111111;
  height: calc(100vh - 160px);
  overflow-y: auto;
  min-width: 1000px;
  margin: 1vmax 0;
  border-radius: 1vmax;
  position: relative;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin: 10px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: #8b4513;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0522d;
  }
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #8b4513;
  margin-bottom: 30px;
  text-align: center;
`;

const RulesList = styled.ol`
  list-style-position: inside;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 800px;
  counter-reset: rule-counter;
`;

const RuleItem = styled(motion.li)`
  background-color: rgba(160, 82, 45, 0.9);
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 20px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  color: #f5f5dc;
  font-size: 1.1rem;
  line-height: 1.5;
  counter-increment: rule-counter;
  text-align: justify;
  text-justify: inter-word;

  &::marker {
    color: #ffd700;
    font-weight: bold;
  }
`;

const RulesPage = () => {
  const rules = [
    "Игра ведется двумя лицами на шашечной доске, разбитой на 64 квадрата, окрашенных в белый и черный цвета, 12-ью шашками белыми, принадлежащими одному игроку, и 12-ью шашками черными, принадлежащими другому игроку.",
    "Доска между играющими кладется так, чтобы большая дорога шла от играющего слева направо.",
    "Шашки с каждой стороны расставляются по черным квадратам на первых трех рядах от играющего.",
    "Ходы играющими делаются поочередно.",
    "За ход считается передвижение шашки вперед на соседний черный квадрат, а также взятие неприятельских шашек.",
    "Если соседний квадрат занят вражеской, допустим, черной шашкой, а следующий за ней черный квадрат свободен, то черная шашка «бьется», т. е. белая шашка перескакивает через черную на следом за ней находящийся свободный черный квадрат, и черную шашку «съедают» — снимают с доски.",
    "За один прием «бьется» столько шашек, сколько их стоит на пути на указанных выше условиях.",
    "В случае, если возможно взять шашки противника одновременно по двум направлением, выбор, вне зависимости от количества, предоставляется усмотрению берущего.",
    "При взятии шашки снимаются с доски только по окончании хода.",
    "Два раза в один прием при ходе брать шашку (перекрещивать ее бьющей) не допускается.",
    "Если шашка одного из играющих во время игры проникнет до последнего ряда, то она превращается в дамку.",
    "Если простая шашка при взятии шашек противника становится дамкой и после этого ей вновь открывается возможность бить неприятельские шашки, то таковое взятие обязательно (в отличие от польских шашек).",
    "Дамка имеет право движения по всей длине ряда черных квадратов на любое место, не занятое шашками.",
    "«Бьет» она вражескую шашку, если за той непосредственно остается свободный черный квадрат. Бьет она по всей длине ряда черных квадратов на любом от себя расстоянии.",
    "Как простой шашкой, так и дамкой обязаны «бить», если к тому представляется случай.",
    "Как простая, так и дамка «бьют» неприятельские шашки как вперед, так и назад.",
    "Выигравшим партию признается тот, кто либо заберет все шашки противника, либо лишит его возможности делать какие-либо ходы, заперев оставшиеся на доске шашки.",
    "При невозможности для обеих сторон выиграть партию, игра признается ничьей.",
    "При трижды повторившихся непосредственно одних и тех же ходах с одной стороны, противнику предоставляется право признать игру ничьей.",
    "При борьбе трех дамок против одной для выигрыша предоставляется не свыше 15 ходов.",
    "Если при одной дамке имеется еще одна или несколько шашек, для выигрыша предоставляется не свыше 30 ходов, впредь до изменения в соотношении сил.",
    "При не достижении выигрыша в обоих последних случаях игра признается ничьей.",
    "Чтобы сохранить в памяти сыгранную партию, ее записывают. Для этого все продольные к играющему ряды шашечницы отмечаются буквами: а, b, с, d, e, f, g, h. Поперечные ряды отмечаются цифрами: 1, 2, 3, 4, 5, 6, 7 и 8.",
    "Чтобы записать ход шашки, отмечают сперва клетку на которой она стояла, посредством цифры и буквы, которые соответствуют данной клетке, ставят тире и приписывают затем таким же образом название клетки, на которую она становится.",
    "Если нужно обозначить снимание шашки с доски, то между наименованием клетки, с которой начинается движение, и наименованием клетки, на которую ставится шашка после боя, ставится вместо тире двоеточие (иногда знак X).",
    "При бое ряда шашек обозначается только начало и конец боя, опуская промежуточные клетки.",
  ];

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <RulesContainer variants={listVariants} initial="hidden" animate="visible">
      <PageTitle>Правила игры в шашки</PageTitle>
      <RulesList>
        {rules.map((rule, index) => (
          <RuleItem
            key={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {rule}
          </RuleItem>
        ))}
      </RulesList>
    </RulesContainer>
  );
};

export default RulesPage;
