import anchors from '../../anchors.json';
import type {State} from './graph';

export const startMs = anchors['p04-a01-order-state-graph-start'];

type Beat = {
  at: number;
  label: string;
  message: string;
  active?: State;
  outgoing?: State;
  from?: State;
  to?: State;
};

const overview: Beat = {
  at: startMs, label: 'Переходы',
  message: 'Стрелка показывает, в какое состояние может перейти заявка.',
};
const cues: readonly Beat[] = [
  overview,
  {at: 3_213_260, outgoing: 'PENDING_NEW', label: 'PENDING_NEW', message: 'Возможны принятие, отказ и быстрое исполнение до подтверждения.'},
  {at: 3_216_760, outgoing: 'NEW', label: 'NEW', message: 'Принятая заявка может исполниться, истечь или перейти к отмене.'},
  {at: 3_220_000, outgoing: 'PARTIALLY_FILLED', label: 'PARTIALLY_FILLED', message: 'Остаток можно исполнить или запросить его отмену.'},
  {at: 3_223_040, outgoing: 'PENDING_CANCEL', label: 'PENDING_CANCEL', message: 'В ожидании отмены возможны частичное и полное исполнение.'},
  {at: 3_226_700, label: 'Редкие статусы Alpaca', message: 'SUSPENDED — торги по заявке приостановлены.  CALCULATED — идут расчёты.'},
  {at: 3_231_260, label: 'Конечные состояния', message: 'Из FILLED, CANCELED, REJECTED и EXPIRED переходов больше нет.'},
  {at: 3_234_060, from: 'PENDING_CANCEL', to: 'FILLED', label: 'Гонка исполнения и отмены', message: 'Пока мы ждём отмены, заявка может исполниться.'},
  {at: 3_241_160, active: 'PENDING_NEW', label: 'Покупка', message: 'Брокер отправляет заявку на биржу. Деньги в резерве.'},
  {at: 3_243_400, from: 'PENDING_NEW', to: 'NEW', active: 'NEW', label: 'Покупка', message: 'Биржа приняла заявку.'},
  {at: 3_247_080, from: 'NEW', to: 'PENDING_CANCEL', active: 'PENDING_CANCEL', label: 'Клиент нажал «Отменить»', message: 'Запрос отправлен. Деньги остаются в резерве.'},
  {at: 3_248_280, active: 'PENDING_CANCEL', label: 'На бирже', message: 'Сделка уже прошла. Брокер ещё ждёт ответ.'},
  {at: 3_250_340, active: 'PENDING_CANCEL', label: 'Ответ на отмену', message: 'Too late to cancel — биржа отклонила запрос на отмену.'},
  {at: 3_254_800, from: 'PENDING_CANCEL', to: 'FILLED', active: 'FILLED', label: 'Отчёт FILL', message: 'Биржа подтвердила исполнение заявки.'},
];

export function beatAt(timeMs: number): Beat {
  let current = overview;
  for (const cue of cues) {
    if (cue.at > startMs + timeMs) break;
    current = cue;
  }
  return current;
}
