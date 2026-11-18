import React from 'react';
import {BrokerShort, type Platform} from '../../shared/vertical/BrokerShort';
import {Board} from './Board';
import cuts from './cuts.json';

const captions: readonly (readonly [number, string])[] = [
  [100,'Что произойдёт, если человек'], [1850,'сидит в двух вкладках'], [3230,'или с двух устройств?'],
  [4750,'У него на счету $1 000.'], [6620,'Он одновременно жмёт'], [8180,'«Купить» на $800.'],
  [9510,'Оба читают $1 000,'], [10800,'оба проходят.'], [11790,'На биржу уходит $1 600.'],
  [14000,'Следующее улучшение —'], [15160,'заморозка денег и outbox'], [16800,'в одной транзакции.'],
  [18700,'Тут мы закроем дыру'], [19850,'с двумя устройствами,'], [20900,'с двумя одновременными запросами.'],
  [22400,'Это обычный UPDATE accounts.'], [25000,'Вычитаем, холдим деньги,'],
  [27900,'вставляем заявку в orders'], [29400,'и в outbox для отправки на биржу.'],
];

const story = {
  slug: 'double-buy',
  hook: <>На счёте $1 000.<br/>Как на биржу ушли<br/>заявки на $1 600?</>,
  label: (time: number) => time < 13900 ? 'Проверка баланса' : 'Резерв на счёте',
  captions: captions.map(([at,text]) => ({at,text})),
};

export function Pilot({platform}: {platform: Platform}) {
  return <BrokerShort platform={platform} story={story} cuts={cuts} Board={Board}/>;
}

export default function Composition() {
  return <Pilot platform="shorts"/>;
}
