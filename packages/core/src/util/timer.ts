// eslint-disable-next-line import/prefer-default-export, @typescript-eslint/explicit-module-boundary-types
export const useTimer = () => {
  let startTime: number;
  let stopTime: number;
  // eslint-disable-next-line no-return-assign
  const start = () => (startTime = performance.now());
  // eslint-disable-next-line no-return-assign
  const stop = () => (stopTime = performance.now());
  const getTime = (precision = 2) =>
    Number.parseFloat((stopTime - startTime).toFixed(precision));
  return { start, stop, getTime };
};
