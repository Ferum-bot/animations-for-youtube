import React from 'react';
import {staticFile} from 'remotion';
import {PresenterPane} from '../PresenterPane';

export const media = (name: string) => staticFile('generated/009-cassandra-scylladb/history-shorts/01/'+name);
const cuts = [
  {from: 0, to: 2600, file: 'question', trim: 0},
  {from: 2600, to: 7733.333, file: 'inbox', trim: 0},
  {from: 7733.333, to: 18400, file: 'origins', trim: 0},
  {from: 18400, to: 31100, file: 'authors', trim: 0},
  {from: 31100, to: 41400, file: 'inbox', trim: 5133.333},
] as const;

const clips = cuts.map(cut => ({...cut, file:'generated/009-cassandra-scylladb/history-shorts/01/'+cut.file+'.mp4'}));
export function Presenter() {
  return <PresenterPane cuts={clips}/>;
}
