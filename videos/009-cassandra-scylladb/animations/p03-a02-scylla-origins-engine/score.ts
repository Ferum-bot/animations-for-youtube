import type {SourceCaptionText as Caption} from '../../shared/source-reading/SourceCaption';
import figures from './figures.json';
import passages from './passages.json';

export type FigureId = keyof typeof figures;
export type PassageId = keyof typeof passages;
type CoverId = 'story'|'osv'|'dor'|'nadav'|'code'|'cache'|'shards'|'shared'|'io';
// Camera bounds in units of image width. The height is always 9/16 of the width.
export type Crop = readonly [left:number, top:number, width:number];
type Cover = {kind:'cover'; id:CoverId};
type Passage = {kind:'passage'; id:PassageId; caption:Caption; alreadyAtText?:boolean; focusMs?:number; quote?:boolean};
type Figure = {kind:'figure'; id:FigureId; from:Crop; to?:Crop; moveAt?:number; caption?:Caption};
type Portrait = {kind:'portrait'};
export type Shot = {at:number} & (Cover|Passage|Figure|Portrait);
export const durationMs=190100;

export const score = [
  {at:0,kind:'cover',id:'story'},
  {at:3950,kind:'portrait'},
  {at:8900,kind:'passage',id:'story-kvm',caption:{credit:'ScyllaDB · История компании',lines:['KVM — Kernel Virtual Machine']}},
  {at:13100,kind:'cover',id:'osv'},
  {at:18000,kind:'figure',id:'paper',from:[0,0.12,1],to:[0.055,0.35,0.74],moveAt:2300,
    caption:{credit:'USENIX ATC · Cloudius Systems, 2014',original:'running a single application on a virtual machine',lines:['Одно приложение в виртуальной машине']}},
  {at:27300,kind:'figure',id:'paper',from:[0.05,0.375,0.89],to:[0.47,0.38,0.52],moveAt:200,
    caption:{credit:'Рис. 1 · Традиционная виртуальная машина',lines:['OSv упрощает стек для одного приложения.']}},
  {at:31800,kind:'cover',id:'dor'},
  {at:36600,kind:'passage',id:'dor-redis',focusMs:3800,quote:true,caption:{credit:'Дор Лаор · Software Engineering Daily',lines:['В их тесте Redis на OSv ускорился на 70%.']}},
  {at:45400,kind:'passage',id:'dor-linux',alreadyAtText:true,quote:true,caption:{credit:'Дор Лаор · о Cassandra на OSv',lines:['С Cassandra выигрыша относительно Linux не было.']}},
  {at:52500,kind:'passage',id:'dor-complexity',alreadyAtText:true,quote:true,caption:{credit:'Дор Лаор · вывод команды',lines:['Причину стали искать в самой Cassandra.']}},
  {at:58600,kind:'cover',id:'nadav'},
  {at:62000,kind:'passage',id:'nadav-business',quote:true,caption:{credit:'Надав Харэль · о проекте OSv',lines:['Проект не принёс того бизнеса, на который мы рассчитывали.']}},
  {at:71800,kind:'cover',id:'code'},
  {at:76400,kind:'passage',id:'code-interface',quote:true,caption:{credit:'Дор Лаор · CodeStory',lines:['Новая реализация со знакомым интерфейсом Cassandra.']}},
  {at:87400,kind:'passage',id:'compat-cql',caption:{credit:'Документация ScyllaDB · совместимость',lines:['CQL и протокол знакомы приложению.', 'Поддержка функций зависит от версии.']}},
  {at:96500,kind:'passage',id:'story-pivot',quote:true,caption:{credit:'ScyllaDB · История компании',lines:['В середине 2014 года команда сменила направление.']}},
  {at:104050,kind:'figure',id:'cpp',from:[0.025,0.015,0.95],to:[0.052,0.042,0.75],moveAt:1600},
  {at:109600,kind:'figure',id:'cpp',from:[0.04,0.08,0.90],to:[0.485,0.47,0.49],moveAt:400,
    caption:{credit:'ScyllaDB · 7 Design Principles, с. 5',lines:['Нативный C++ убирает паузы Java GC.']}},
  {at:116450,kind:'cover',id:'cache'},
  {at:118800,kind:'passage',id:'cache-elastic',quote:true,caption:{credit:'ScyllaDB · Inside the Internal Cache',lines:['Кеш занимает свободную память и уступает её под нагрузкой.']}},
  {at:124100,kind:'cover',id:'shards'},
  {at:128300,kind:'passage',id:'shards-core',quote:true,caption:{credit:'ScyllaDB · Shard-per-Core Architecture',lines:['Один рабочий поток на выделенное логическое ядро.']}},
  {at:132600,kind:'figure',id:'cluster-map',from:[0,-0.10,1],to:[0.493,-0.004,0.51],moveAt:1800},
  {at:137600,kind:'figure',id:'resource-map',from:[0,-0.016,1],to:[0.19,0.115,0.765],moveAt:2100},
  {at:143200,kind:'figure',id:'resource-map',from:[0,-0.016,1],
    caption:{credit:'ScyllaDB · ресурсы отдельного шарда',lines:['В примере с 16 логическими ядрами таких шардов 16.']}},
  {at:147800,kind:'cover',id:'shared'},
  {at:150500,kind:'passage',id:'shared-passing',quote:true,caption:{credit:'Seastar · Shared-nothing Design',lines:['Данные другого шарда запрашивают сообщением.']}},
  {at:157900,kind:'figure',id:'nothing',from:[0,-0.01,1],to:[0.49,0.10,0.41],moveAt:2300},
  {at:164200,kind:'figure',id:'nothing',from:[0.49,0.10,0.41],to:[0,-0.01,1],moveAt:0,
    caption:{credit:'Seastar · устройство одного сервера',lines:['У каждого шарда свой владелец данных.']}},
  {at:168600,kind:'cover',id:'io'},
  {at:171800,kind:'figure',id:'scheduler',from:[0.012,0.025,0.98],to:[0.046,0.793,0.91],moveAt:1000},
  {at:177500,kind:'passage',id:'dev-compaction',quote:true,caption:{credit:'ScyllaDB · docs/dev/isolation.md',lines:['Compaction должна успевать за потоком записи.']}},
  {at:184000,kind:'passage',id:'dev-isolate',alreadyAtText:true,quote:true,caption:{credit:'ScyllaDB · Performance Isolation',lines:['Планировщик распределяет ресурсы между видами работы.']}},
] as const satisfies readonly Shot[];
