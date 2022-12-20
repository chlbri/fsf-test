export type TestResult<
  TC extends Record<string, unknown> = Record<string, unknown>,
> = {
  context: TC;
  state: string;
};

export type TestHelper<
  TC extends Record<string, unknown> = Record<string, unknown>,
  R = TC,
> = (result?: R, helpers?: TestResult<TC>[]) => boolean;
