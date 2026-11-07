export const replicas = ['A', 'B', 'C'] as const;
export type Replica = (typeof replicas)[number];
export type Host = Replica | 'D' | 'E' | 'F';
export const oldBody = 'На платформе';
export const newBody = 'У выхода';
export const messageLabel = 'чат 42 · №107';
