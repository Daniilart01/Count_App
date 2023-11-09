export const getTimerString = (secondsTotal: number) => {
  const minutes = Math.floor(secondsTotal / 60);
  const seconds = secondsTotal - minutes * 60;

  let res = minutes + ':';

  if (seconds < 10) {
    res += '0' + seconds;
  } else {
    res += seconds;
  }

  return res;
};