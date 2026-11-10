import React from 'react';
import {easing, mix, progress, SourceImage} from '@channel/motion-v2';
import {Quote, type Passage} from '../Quote';
import {archive} from './score';

type Reading = {
  cover: string;
  coverOffset?: number;
  page: string;
  credit: string;
  scrollAt: number;
  markAt: number;
  passage: Passage;
};

// The positions refer to the 720 px wide view of each original capture.
export const interviews = {
  business: {
    cover: 'nadav-cover', page: 'nadav-business', credit: 'Надав Харэль · интервью ScyllaDB',
    scrollAt: 500, markAt: 2450,
    passage: {label: 'Проект OSv', result: 'Спроса не хватило', lines: [
      {text:'it did not yield the', x:512.7, baseline:422.4, width:72.6, finalWidth:500},
      {text:'business that we had hoped it would', x:110, baseline:439.8, width:151.4, finalWidth:897},
    ]},
  },
  interface: {
    cover: 'code-cover', page: 'code-interface', credit: 'Дор Лаор · CodeStory',
    scrollAt: 3200, markAt: 6450,
    passage: {label: 'Новая база', result: 'Привычный интерфейс', lines: [
      {text:'write a new database', x:306, baseline:422.4, width:88, finalWidth:637},
      {text:'with an existing familiar interface', x:396, baseline:422.4, width:138, finalWidth:890},
    ]},
  },
  pivot: {
    cover: 'story-cover', coverOffset: 147, page: 'story-pivot', credit: 'The ScyllaDB Story',
    scrollAt: 450, markAt: 2350,
    passage: {label: 'Середина 2014-го', result: 'От OSv к ScyllaDB', lines: [
      {text:'in mid-2014 the', x:330, baseline:422.5, width:67, finalWidth:482},
      {text:'team decided to pivot away from OSv', x:110.7, baseline:435.8, width:155, finalWidth:891},
    ]},
  },
} satisfies Record<string, Reading>;

export function Archive({reading, elapsed}: {readonly reading: Reading; readonly elapsed: number}) {
  const scroll = progress(elapsed, reading.scrollAt, reading.markAt-240, easing.transform);
  const scale = 1.96;
  const pageX = -147;
  const coverOffset = reading.coverOffset ?? 405;
  const pageY = mix(coverOffset*scale, 835-430*scale, scroll);
  return <g>
    <rect width={1080} height={1920} fill="white"/>
    <g transform={`translate(${pageX} ${pageY}) scale(${scale})`}>
      <SourceImage src={archive+reading.cover+'.jpg'} x={0} y={-coverOffset} width={720} height={405}/>
      <SourceImage src={archive+reading.page+'.jpg'} x={0} y={0} width={720} height={690}/>
    </g>
    <Quote credit={reading.credit} passage={reading.passage} time={elapsed} start={reading.markAt}
      pageX={pageX} pageY={pageY} scale={scale} visibility={1}/>
  </g>;
}
