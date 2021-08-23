export const notEmpty = <T>(val: T | null | undefined): val is T => {
  return val != null;
};

export const buildFunction = (fn: string): Function =>
  new Function('value', `return ${fn}`);
