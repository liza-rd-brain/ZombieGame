export function getRandomList<T>(list: Array<T>): Array<T> {
  const randomList = list;
  for (let i = randomList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomList[i], randomList[j]] = [randomList[j], randomList[i]];
  }
  return randomList;
}
