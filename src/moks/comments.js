import dayjs from "dayjs";

const COMMENTS = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`,
  `Обязательно посмотрю еще`,
  `Зачем такое вообще снимать`,
  `Лучший фильм что видел`
];

const EMOJI = [
  `angry.png`,
  `puke.png`,
  `sleeping.png`,
  `smile.png`
];

const AUTHORS = [
  `Tim Macoveev`,
  `John Doe`,
  `Artem Vafin`,
  `Orange`
];

const generateRandomItem = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);

  return array[randomIndex];
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateCommentDate = () => {
  const maxDaysGap = 10;
  const maxYearsGap = 1;
  const maxMonthsGap = 6;
  const maxHour = 24;
  const maxMinute = 59;
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  const yearsGap = getRandomInteger(-maxYearsGap, 0);
  const monthsGap = getRandomInteger(-maxMonthsGap, 0);
  const hourGap = getRandomInteger(0, maxHour);
  const minuteGap = getRandomInteger(0, maxMinute);

  return dayjs().add(daysGap, `day`).add(yearsGap, `year`).add(monthsGap, `month`).add(hourGap, `hour`).add(minuteGap, `minute`).toDate();
};

export const generateRandomComment = () => {
  return {
    id: null,
    text: generateRandomItem(COMMENTS),
    emoji: generateRandomItem(EMOJI),
    author: generateRandomItem(AUTHORS),
    date: generateCommentDate(),
  };
};