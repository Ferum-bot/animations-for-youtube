/** Estimates from materials p. 23; rows are scenarios, not additive peak loads. */
export const capacityRows = [
  {topic: 'push.p0', peak: 'до 5 000/с*', callTime: '0,2 с', inFlight: '1 000', parallelism: '50 × 20'},
  {topic: 'push.bulk', peak: '5 000/с', callTime: '0,2 с', inFlight: '1 000', parallelism: '50 × 20'},
  {topic: 'sms.p0', peak: '~500/с', callTime: '0,3 с', inFlight: '150', parallelism: '16 × 10'},
  {topic: 'email.bulk', peak: '3 000/с', callTime: '0,3 с', inFlight: '900', parallelism: '48 × 20'},
] as const;

export const capacityColumns = [
  {id: 'topic', width: 340, heading: ['Топик']},
  {id: 'peak', width: 360, heading: ['Поток', 'в пике']},
  {id: 'callTime', width: 290, heading: ['Время', 'вызова']},
  {id: 'inFlight', width: 320, heading: ['Нужно', 'in-flight']},
  {id: 'parallelism', width: 570, heading: ['Партиции ×', 'конкурентность']},
] as const satisfies readonly {
  readonly id: keyof typeof capacityRows[number];
  readonly width: number;
  readonly heading: readonly string[];
}[];

export type CapacityField = Exclude<typeof capacityColumns[number]['id'], 'topic'>;
