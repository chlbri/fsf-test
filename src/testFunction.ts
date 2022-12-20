import { MachineFunction } from '@bemedev/fsf';
import { createTestMachine } from './createTestMachine';

export default function testFunction<
  TA = unknown,
  TC extends Record<string, unknown> = Record<string, unknown>,
  R = TC,
>(machine: MachineFunction<TA, TC, R>) {
  const _machine = createTestMachine(machine);
  return _machine.test;
}
