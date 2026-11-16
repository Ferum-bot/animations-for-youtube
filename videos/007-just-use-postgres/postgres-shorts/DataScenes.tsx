import React from 'react';
import {
  Area,
  Caption,
  Code,
  Down,
  Heading,
  Note,
  Record,
  Table,
  ink,
  motion,
  type SceneProps,
} from './ui';

const products = [
  ['1', 'Футболка', '1990'],
  ['2', 'Йогурт', '89'],
  ['3', 'Кружка', '790'],
];
const attrs = '{\n  "size": "M",\n  "color": "black"\n}';

function Products({t}: {readonly t: number}) {
  if (t < 162.8)
    return (
      <>
        <Heading>JSONB в Postgres</Heading>
        <Area>
          <Code text={attrs} label="JSON" size={44} />
          <Down amount={motion(t, 150.2)} label="один раз" />
          <div style={{opacity: motion(t, 150.2)}}>
            <Record accent>JSONB · бинарное значение</Record>
          </div>
          <div style={{opacity: motion(t, 156.8), marginTop: 90, fontSize: 46}}>
            Условия и индексы
            <br />
            без повторного разбора JSON
          </div>
        </Area>
      </>
    );
  if (t < 183.1)
    return (
      <>
        <Heading>
          Одна таблица.
          <br />
          Разные товары.
        </Heading>
        <Area>
          <Table
            headers={['id', 'name', 'price']}
            rows={products}
            highlight={t < 178 ? 0 : 1}
          />
          <div style={{marginTop: 60}}>
            <Caption>attrs · JSONB</Caption>
            <Code
              label="JSON"
              size={39}
              active={t < 178 ? 'color' : 'best_before'}
              text={
                t < 178
                  ? attrs
                  : '{\n  "best_before": "2026-11-01",\n  "ingredients": [\n    "молоко", "закваска"\n  ]\n}'
              }
            />
          </div>
        </Area>
        <Note>Общие поля — в колонках. Остальные свойства — в attrs.</Note>
      </>
    );
  return (
    <>
      <Heading>Найти чёрные товары</Heading>
      <Area>
        <Code
          size={32}
          text={
            'CREATE INDEX products_attrs_idx\nON products USING gin (attrs);'
          }
          active="gin"
        />
        <div style={{marginTop: 40}}>
          <Code
            size={37}
            active="@>"
            text={
              'SELECT name\nFROM products\nWHERE attrs @>\n  \'{"color": "black"}\';'
            }
          />
        </div>
        <div style={{marginTop: 55, opacity: motion(t, 185.4)}}>
          <Table
            headers={['name', 'color']}
            rows={[
              ['Футболка', 'black'],
              ['Кружка', 'black'],
            ]}
          />
        </div>
      </Area>
    </>
  );
}

function JsonCost({t}: {readonly t: number}) {
  if (t < 209.4)
    return (
      <>
        <Heading>
          Одно поле.
          <br />
          Новое значение.
        </Heading>
        <Area>
          <Caption>attrs · JSONB</Caption>
          <Code
            text={
              '{\n  "size": "M",\n  "color": "' +
              (t < 199.5 ? 'black' : 'white') +
              '"\n}'
            }
            label="JSON"
            active="color"
            size={47}
          />
          <Down amount={motion(t, 198.4)} />
          <div style={{opacity: motion(t, 198.4)}}>
            <Record accent>
              Записывается новое
              <br />
              значение JSONB целиком
            </Record>
          </div>
          <div style={{opacity: motion(t, 203.4), marginTop: 65}}>
            <Record>Большие значения → TOAST</Record>
            <Caption>Сжатие / отдельное хранение</Caption>
          </div>
        </Area>
      </>
    );
  if (t < 223.1)
    return (
      <>
        <Heading>
          Что знает
          <br />
          планировщик?
        </Heading>
        <Area>
          <Table
            headers={['Колонка', 'Статистика']}
            rows={[
              ['price', 'есть'],
              ['attrs → color', 'нужна отдельно'],
            ]}
            highlight={1}
          />
          <div style={{marginTop: 75, opacity: motion(t, 214.3)}}>
            <Code
              text={
                "CREATE STATISTICS color_stats\nON (attrs->>'color')\nFROM products;\n\nANALYZE products;"
              }
              active="STATISTICS"
              size={35}
            />
          </div>
        </Area>
        <Note>
          Без нужной статистики возможна ошибка в оценке количества строк.
        </Note>
      </>
    );
  return (
    <>
      <Heading>
        {t < 234 ? 'За индекс платим записью' : 'JSONB хорошо подходит'}
      </Heading>
      <Area>
        <Code label="JSON" text={attrs} size={42} />
        <Down amount={motion(t, 223.2)} />
        <div style={{opacity: motion(t, 223.2)}}>
          <Table
            headers={['GIN: ключ / значение', 'Товар']}
            rows={[
              ['size / M', '1'],
              ['color / black', '1'],
            ]}
          />
        </div>
        <div style={{opacity: motion(t, 234), marginTop: 60, fontSize: 47}}>
          Метаданные
          <br />и внешние документы
        </div>
      </Area>
      <Note>Условия чтения ускоряются; индекс тоже нужно обновлять.</Note>
    </>
  );
}

function Search({t}: {readonly t: number}) {
  if (t < 311)
    return (
      <>
        <Heading>
          Полнотекстовый поиск
          <br />
          уже есть в Postgres
        </Heading>
        <Area>
          <Record>Очередь задач на Postgres</Record>
          <Down amount={motion(t, 291.3)} />
          <div style={{opacity: motion(t, 291.3)}}>
            <Code
              label="tsvector"
              text={"'задач':2\n'очеред':1\n'postgres':4"}
              size={48}
            />
          </div>
        </Area>
        <Note>
          Слова → лексемы и позиции. Это поисковое представление текста.
        </Note>
      </>
    );
  if (t < 319.5)
    return (
      <>
        <Heading>Заголовок весит больше</Heading>
        <Area>
          <Record>title · Очередь задач на Postgres</Record>
          <div style={{marginTop: 22}}>
            <Record>body · Воркеры забирают задачи…</Record>
          </div>
          <Down amount={motion(t, 312.6)} />
          <Code
            size={31}
            active={t > 316.8 ? "'A'" : 'search'}
            text={
              "search tsvector GENERATED ALWAYS AS (\n  setweight(\n    to_tsvector('russian', title), 'A'\n  ) || setweight(\n    to_tsvector('russian', body), 'B'\n  )\n) STORED"
            }
          />
        </Area>
      </>
    );
  return (
    <>
      <Heading>Слова → индекс → статьи</Heading>
      <Area>
        <Code
          size={32}
          text={
            'CREATE INDEX articles_search_idx\nON articles USING gin (search);'
          }
          active="gin"
        />
        <div style={{marginTop: 40}}>
          <Code
            size={31}
            active="@@"
            text={
              "SELECT title, ts_rank(search, q)\nFROM articles,\n  websearch_to_tsquery('russian',\n    'очередь postgres -kafka') q\nWHERE search @@ q\nORDER BY ts_rank(search, q) DESC;"
            }
          />
        </div>
        <div style={{marginTop: 45, opacity: motion(t, 327.8)}}>
          <Table
            headers={['Статья', 'Релевантность']}
            rows={[
              ['Очередь задач…', '0.974'],
              ['Кэш в Postgres', '0.579'],
            ]}
          />
        </div>
      </Area>
    </>
  );
}

function SearchLimits({t}: {readonly t: number}) {
  if (t < 344)
    return (
      <>
        <Heading>
          Поиск Postgres.
          <br />
          Ограничения тоже.
        </Heading>
        <Area>
          <Caption>{t < 338 ? 'Стемминг' : 'Опечатки'}</Caption>
          <Record>{t < 338 ? 'задачи → задач' : 'Екатеренбург'}</Record>
          <Down amount={motion(t, 338)} />
          <div style={{opacity: motion(t, 338)}}>
            <Record accent>Екатеринбург</Record>
            <div style={{marginTop: 45}}>
              <Code
                size={37}
                text={
                  "CREATE EXTENSION pg_trgm;\n\nSELECT name FROM cities\nWHERE name % 'Екатеренбург';"
                }
                active="pg_trgm"
              />
            </div>
          </div>
        </Area>
        <Note>
          {t < 338
            ? 'Стемминг отрезает окончания по правилам.'
            : 'Для похожих строк используем отдельное расширение pg_trgm.'}
        </Note>
      </>
    );
  return (
    <>
      <Heading>
        {t < 351 ? 'Ранжирование —\nотдельная задача' : 'Где этого достаточно?'}
      </Heading>
      <Area>
        <Caption>Поиск в административном словаре</Caption>
        <Record>Екатеринбург</Record>
        <div style={{marginTop: 25}}>
          <Record>Казань</Record>
        </div>
        <div style={{marginTop: 25}}>
          <Record>Москва</Record>
        </div>
        <div
          style={{
            marginTop: 110,
            opacity: motion(t, 355.9),
            fontSize: 51,
            lineHeight: 1.25,
          }}
        >
          Несколько тысяч строк.
          <br />
          Простой поиск.
        </div>
        <div
          style={{
            marginTop: 65,
            opacity: motion(t, 362.9),
            fontSize: 43,
            color: ink.signal,
          }}
        >
          Сложный поиск →<br />
          специализированный движок
        </div>
      </Area>
      <Note>Оценка автора выпуска, а не сравнительный бенчмарк.</Note>
    </>
  );
}

function Cache({t}: {readonly t: number}) {
  if (t < 397)
    return (
      <>
        <Heading>Кэш в Postgres</Heading>
        <Area>
          <Code
            size={35}
            active="UNLOGGED"
            text={
              'CREATE UNLOGGED TABLE cache (\n  key text PRIMARY KEY,\n  value jsonb NOT NULL,\n  expires_at timestamptz NOT NULL\n);'
            }
          />
          <Down amount={motion(t, 387.1)} />
          <Record>
            Изменения этой таблицы
            <br />
            не попадают в WAL
          </Record>
        </Area>
      </>
    );
  const expired = t >= 409.3;
  return (
    <>
      <Heading>
        {t < 402.7
          ? 'Три поля для кэша'
          : t < 406.1
            ? 'Записать / обновить'
            : t < 409.3
              ? 'Прочитать живое'
              : 'Удалить просроченное'}
      </Heading>
      <Area>
        <Table
          headers={['Поле', 'Значение']}
          rows={[
            ['key', 'user:42:feed'],
            ['value', '{items: [1, 2, 3]}'],
            ['expires_at', 'сейчас + 5 минут'],
          ]}
          highlight={expired ? 2 : 1}
        />
        <div
          style={{marginTop: 65, opacity: expired ? 1 - motion(t, 410.2) : 1}}
        >
          <Record accent>{expired ? 'TTL истёк' : 'items: [1, 2, 3]'}</Record>
        </div>
        <div style={{marginTop: 50}}>
          {t < 406.1 ? (
            <div style={{fontSize: 45}}>
              INSERT … ON CONFLICT
              <br />
              DO UPDATE
            </div>
          ) : (
            <Code
              size={35}
              active={expired ? 'DELETE' : 'expires_at'}
              text={
                expired
                  ? 'DELETE FROM cache\nWHERE expires_at < now();'
                  : "SELECT value FROM cache\nWHERE key = 'user:42:feed'\n  AND expires_at > now();"
              }
            />
          )}
        </div>
      </Area>
      <Note>
        {expired
          ? 'Очистку запускает фоновая задача.'
          : 'UNLOGGED-таблица · пример из выпуска'}
      </Note>
    </>
  );
}

function CacheLimits({t}: {readonly t: number}) {
  if (t < 442.7)
    return (
      <>
        <Heading>Кэш через SQL</Heading>
        <Area>
          <Code
            text={"SELECT value FROM cache\nWHERE key = 'user:42:feed';"}
            size={36}
          />
          <Down />
          <Record>Разбор SQL</Record>
          <Down amount={motion(t, 436.4)} />
          <Record>План + транзакция</Record>
        </Area>
        <Note>
          Горячие данные могут быть в памяти. Стоимость обработки запроса
          остаётся.
        </Note>
      </>
    );
  return (
    <>
      <Heading>
        {t < 451.8 ? 'UNLOGGED после сбоя' : 'TTL нужно организовать'}
      </Heading>
      <Area>
        <Caption>cache · user:42:feed</Caption>
        <div style={{opacity: t < 451.8 ? 1 - motion(t, 443.5) : 1}}>
          <Record>items: [1, 2, 3]</Record>
        </div>
        <div style={{marginTop: 60, fontSize: 47, color: ink.signal}}>
          {t < 451.8 ? 'После аварии — пусто' : 'Время вышло ≠ строка удалена'}
        </div>
        <div style={{marginTop: 80}}>
          {t < 451.8 ? (
            <>
              <Record>Реплика</Record>
              <Caption>UNLOGGED-данных здесь нет</Caption>
            </>
          ) : (
            <>
              <Code
                size={37}
                text={'DELETE FROM cache\nWHERE expires_at < now();'}
              />
              <Down amount={motion(t, 461.7)} />
              <Record>
                VACUUM освобождает место
                <br />
                для повторного использования
              </Record>
            </>
          )}
        </div>
      </Area>
      <Note>
        {t < 451.8
          ? 'Аварийная остановка отличается от штатного перезапуска.'
          : 'Встроенного TTL / вытеснения как у Redis здесь нет.'}
      </Note>
    </>
  );
}

export function DataScenes({number, t}: SceneProps) {
  switch (number) {
    case 2:
      return <Products t={t} />;
    case 3:
      return <JsonCost t={t} />;
    case 4:
      return <Search t={t} />;
    case 5:
      return <SearchLimits t={t} />;
    case 6:
      return <Cache t={t} />;
    case 7:
      return <CacheLimits t={t} />;
    default:
      throw new Error(`Unsupported data scene ${number}`);
  }
}
