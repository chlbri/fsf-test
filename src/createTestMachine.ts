import { MachineFunction } from '@bemedev/fsf';
import { TestMachineFunction } from './TestMachine';

export function createTestMachine<
  TA = unknown,
  TC extends Record<string, unknown> = Record<string, unknown>,
  R = TC,
>(machine: MachineFunction<TA, TC, R>) {
  const props = machine.__props;
  const _machine = new TestMachineFunction(props);
  return _machine;
}
