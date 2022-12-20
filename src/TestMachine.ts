import { MachineFunction } from '@bemedev/fsf';
import { TestHelper, TestResult } from './types';

export class TestMachineFunction<
  TA = unknown,
  TC extends Record<string, unknown> = Record<string, unknown>,
  R = TC,
> extends MachineFunction<TA, TC, R> {
  protected _testHelpers: TestResult<TC>[] = [];

  protected _addTestHelper = () => {
    this._testHelpers?.push({
      context: this._context,
      state: this._currentState.value,
    });
  };

  protected _initializeStates = () => {
    super._initializeStates();
    this._addTestHelper();
  };

  //@ts-ignore - Use the parent context
  protected _setCurrentState(value: string) {
    super._setCurrentState(value);
    this._addTestHelper();
  }

  #test = (func: TestHelper<TC, R>) => {
    const check = func(this.data, this._testHelpers);
    if (!check) {
      throw new Error('Test failed');
    }
  };

  test = (event?: TA) => {
    this.start(event);
    return { test: (func: TestHelper<TC, R>) => this.#test(func) };
  };
}
