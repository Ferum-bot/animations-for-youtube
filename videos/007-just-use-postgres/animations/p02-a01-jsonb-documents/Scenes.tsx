import React from 'react';
import {accent, Code, Label, Note, Reveal, Rule, theme} from './ui';
import {products, progress, sql, type ChapterId} from './scene';

type SceneProps = {readonly timeMs: number; readonly compactProgress?: number};
const documentText = '{\n  "size": "M",\n  "color": "black"\n}';

const Binary: React.FC<SceneProps> = ({timeMs}) => {
  const parsed = progress(timeMs, 2500, 800);
  return <>
    <div style={{display: 'grid', gridTemplateColumns: '600px 1fr', gap: 130, marginTop: 48}}>
      <div><Label>НА ВХОДЕ / JSON</Label><Code text={documentText} size={40} />
        <div style={{marginTop: 30, fontSize: 28, color: theme.muted}}>Текст документа</div></div>
      <div style={{opacity: parsed, transform: `translateX(${(1 - parsed) * 35}px)`}}>
        <Label color={accent}>ПРИ ХРАНЕНИИ / JSONB</Label>
        <div style={{fontFamily: theme.fontMono, fontSize: 40, lineHeight: 1.8}}>
          <div style={{color: accent}}>object</div>
          <div style={{borderLeft: `2px solid ${theme.line}`, paddingLeft: 42, marginLeft: 10}}>
            <div>size <span style={{color: theme.muted}}>→</span> "M"</div>
            <div>color <span style={{color: theme.muted}}>→</span> "black"</div>
          </div>
        </div>
        <div style={{marginTop: 35, fontSize: 28, color: theme.muted}}>Разобранное бинарное значение</div>
      </div>
    </div>
    <Reveal timeMs={timeMs} at={8300} style={{marginTop: 38, borderTop: `2px solid ${theme.line}`, paddingTop: 24}}>
      <div style={{display: 'flex', gap: 70, fontSize: 32}}><span>Условия</span><span>Индексы</span>
        <span style={{color: accent, opacity: progress(timeMs, 11580)}}>Без повторного разбора JSON</span></div>
    </Reveal>
  </>;
};

const ProductTable: React.FC<{readonly timeMs: number}> = ({timeMs}) =>
  <div style={{width: '100%'}}>
    <div style={{display: 'grid', gridTemplateColumns: '90px 280px 150px 1fr', paddingBottom: 22,
      color: theme.muted, fontFamily: theme.fontMono, fontSize: 27, borderBottom: `2px solid ${theme.line}`}}>
      <span>id</span><span>name</span><span>price</span><span style={{color: accent}}>attrs · jsonb</span>
    </div>
    {products.map((product, index) => <Reveal key={product.id} timeMs={timeMs} at={index * 300}>
      <div style={{display: 'grid', gridTemplateColumns: '90px 280px 150px 1fr', minHeight: 110,
        alignItems: 'center', borderBottom: `1px solid ${theme.line}`}}>
        <span style={{fontFamily: theme.fontMono, fontSize: 29, color: theme.muted}}>{product.id}</span>
        <span style={{fontSize: 35}}>{product.name}</span><span style={{fontSize: 32}}>{product.price}</span>
        <Code text={product.attrs} size={24} />
      </div>
    </Reveal>)}
  </div>;

const Products: React.FC<SceneProps> = ({timeMs}) => {
  if (timeMs < 4800) return <div style={{marginTop: 20}}><Code text={sql.create} size={39} highlight="attrs" /></div>;
  const details = progress(timeMs, 12800);
  const yogurt = timeMs >= 15700;
  return <>
    <div style={{marginTop: 35}}><ProductTable timeMs={timeMs - 4800} /></div>
    {timeMs < 12800 ? <Reveal timeMs={timeMs} at={8500} style={{marginTop: 35}}>
      <div style={{display: 'flex', gap: 28, fontSize: 30}}><span>id / name / price</span>
        <span style={{color: theme.muted}}>— строгие типы</span></div>
    </Reveal> : null}
    <div style={{marginTop: 25, opacity: details}}>
      <Label color={accent}>{yogurt ? 'ЙОГУРТ / ATTRS' : 'ФУТБОЛКА / ATTRS'}</Label>
      <Code text={yogurt ? '"best_before": "2026-11-01"\n"ingredients": ["молоко", "закваска"]' : '"size": "M", "color": "black"'} size={34} />
    </div>
  </>;
};

const Search: React.FC<SceneProps> = ({timeMs, compactProgress = 0}) => {
  const querying = timeMs >= 3700;
  return <>
    <div style={{marginTop: 35}}><Label color={accent}>{querying ? 'УСЛОВИЕ / СОДЕРЖИТ' : 'GIN / ИНДЕКС ПО ATTRS'}</Label>
      <Code text={querying ? sql.query : sql.gin} size={37} highlight={querying ? '@>' : 'gin'} />
    </div>
    <Reveal timeMs={timeMs} at={6000} style={{marginTop: 40}}>
      <Rule /><div style={{position: 'relative', height: 220 + 200 * compactProgress}}>
        <div><Label>РЕЗУЛЬТАТ</Label><Code text={'name        size\nФутболка    M\nКружка      NULL'} size={34} /></div>
        <div style={{position: 'absolute', left: 615 * (1 - progress(compactProgress, 0.55, 0.45)), top: 240 * progress(compactProgress, 0, 0.55)}}><Label color={accent}>СОВПАДЕНИЕ В ОБОИХ ДОКУМЕНТАХ</Label><Code text={'"color": "black"'} size={42} /></div>
      </div>
    </Reveal>
  </>;
};

const Update: React.FC<SceneProps> = ({timeMs}) => {
  const toast = timeMs >= 8380;
  const change = progress(timeMs, 2900);
  if (toast) return <>
    <div style={{marginTop: 35}}><Label color={theme.signal}>TOAST / БОЛЬШОЕ ЗНАЧЕНИЕ</Label>
      <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 80}}>
        <div><div style={{fontSize: 38, marginBottom: 30}}>Строка products</div>
          <Code text={'id  name  price\nattrs → ссылка'} size={38} highlight="attrs" /></div>
        <Reveal timeMs={timeMs} at={9300}><div style={{fontSize: 38, marginBottom: 25}}>TOAST-таблица</div>
          {[0, 1, 2].map(index => <div key={index} style={{borderBottom: `2px solid ${theme.line}`,
            padding: '14px 0', fontFamily: theme.fontMono, fontSize: 30}}>chunk {index} · данные</div>)}</Reveal>
      </div>
    </div>
    <Note>Сначала сжатие → при необходимости вынос из строки</Note>
  </>;
  return <>
    <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 65, marginTop: 45}}>
      <div><Label>ИЗМЕНЕНИЕ</Label><Code text={`"size": "${change > 0.5 ? 'L' : 'M'}"`} size={60} highlight="size" />
        <div style={{marginTop: 35, color: theme.muted, fontSize: 32}}>Одно поле</div></div>
      <Reveal timeMs={timeMs} at={3700}><Label color={theme.signal}>НОВОЕ ЗНАЧЕНИЕ ATTRS</Label>
        <div style={{borderLeft: `4px solid ${theme.signal}`, paddingLeft: 32}}>
          <Code text={'{\n  "size": "L",\n  "color": "black"\n}'} size={43} highlight="size" />
        </div></Reveal>
    </div>
    <Note warning>Перезаписывается весь изменённый JSONB</Note>
  </>;
};

const Planner: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{marginTop: 30}}><Label color={accent}>КОНКРЕТНОЕ ВЫРАЖЕНИЕ</Label><Code text="attrs->>'color'" size={50} /></div>
  {timeMs < 4860 ? <div style={{marginTop: 60, fontSize: 39, lineHeight: 1.6}}>
    Сколько строк совпадёт?<br /><span style={{color: theme.muted}}>Для оценки нужно распределение значений.</span>
  </div> : <Reveal timeMs={timeMs} at={4860} style={{marginTop: 40}}>
    <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 60}}>
      <div><Label>ИНДЕКС ПО ВЫРАЖЕНИЮ</Label><Code text={sql.expressionIndex} size={35} /></div>
      <div><Label>ИЛИ СТАТИСТИКА БЕЗ ИНДЕКСА</Label><Code text={sql.statistics} size={35} highlight="ANALYZE" /></div>
    </div>
  </Reveal>}
  <Note warning={timeMs >= 10580}>{timeMs >= 10580
    ? 'Неточная оценка числа строк → неоптимальный план'
    : 'Оценка строится по статистике, а не по самому наличию GIN'}</Note>
</>;

const GinCost: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 65, marginTop: 40}}>
    <div><Label>ОДНА ВСТАВКА</Label><Code text={documentText} size={43} /></div>
    <div><Label color={theme.signal}>ОБНОВЛЕНИЕ GIN</Label>
      {['size → "M"', 'color → "black"'].map((value, index) =>
        <Reveal key={value} timeMs={timeMs} at={900 + index * 700} style={{padding: '25px 0', borderBottom: `2px solid ${theme.line}`}}>
          <Code text={value} size={37} /><div style={{fontSize: 27, color: theme.muted, marginTop: 12}}>путь + значение → элемент индекса</div>
        </Reveal>)}
    </div>
  </div>
  <Note warning>Одна строка → несколько элементов индекса</Note>
</>;

const Resolved: React.FC<SceneProps> = ({timeMs}) => <>
  <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: 95, marginTop: 45}}>
    <div><Label>СТРОГИЕ ДАННЫЕ</Label><Code text={'id\nname\nprice'} size={49} /></div>
    <div><Label color={accent}>ГИБКИЕ ДАННЫЕ / ATTRS</Label>
      <Reveal timeMs={timeMs} at={700}><div style={{fontSize: 50, marginBottom: 35}}>Метаданные</div></Reveal>
      <Reveal timeMs={timeMs} at={4500}><div style={{fontSize: 50}}>Внешние данные</div></Reveal>
    </div>
  </div>
  <Note>Основная схема остаётся строгой. Атрибуты могут различаться.</Note>
</>;

const sceneComponents = {
  binary: Binary, products: Products, search: Search, update: Update,
  planner: Planner, gin: GinCost, resolved: Resolved,
} satisfies Record<ChapterId, React.FC<SceneProps>>;

export const SceneContent: React.FC<SceneProps & {readonly id: ChapterId}> = ({id, timeMs, compactProgress}) => {
  const Component = sceneComponents[id];
  return <Component timeMs={timeMs} compactProgress={compactProgress} />;
};
