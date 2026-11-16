import React from 'react';
import {Img, staticFile} from 'remotion';
import {asset, ink} from '../palette';

export function Cover() {
  return <div style={{position: 'absolute', inset: 0, backgroundColor: ink.background, color: ink.text}}>
    <div style={{position: 'absolute', left: 72, top: 285, width: 828, fontSize: 92,
      fontWeight: 800, lineHeight: 1.04, letterSpacing: -3}}>Откуда взялось</div>
    <div style={{position: 'absolute', left: 72, top: 530, width: 828, fontSize: 128,
      fontWeight: 800, lineHeight: 1.02, letterSpacing: -4}}>Just Use<br/><span style={{color: ink.signal}}>Postgres?</span></div>
    <Img src={staticFile(asset('history/essay-site.png'))} alt="Эссе Just Use Postgres for Everything"
      style={{position: 'absolute', left: 72, top: 965, width: 828}}/>
    <div style={{position: 'absolute', left: 72, top: 1490, fontSize: 37}}>Эссе → Rails → YouTube</div>
  </div>;
}
