import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import {arrive, useSceneTime, useV2Font, v2FontFamily} from '@channel/motion-v2';
import {EndCard} from './EndCard';
import {ink,paper} from './drawing';

export type Platform = 'shorts' | 'tiktok';
export type BoardProps = {readonly time: number; readonly width: number; readonly left: number};
type Story = {
  readonly slug: string;
  readonly hook: React.ReactNode;
  readonly label: string | ((time: number) => string);
  readonly captions: readonly {readonly at: number; readonly text: string}[];
};

export function BrokerShort({platform,story,cuts,Board}: {
  platform: Platform; story: Story; cuts: readonly {lengthMs: number}[]; Board: React.ComponentType<BoardProps>;
}) {
  const presenterMs = cuts.reduce((total,cut) => total + cut.lengthMs, 0);
  useV2Font();
  const {width,fps} = useVideoConfig();
  const {timeMs} = useSceneTime();
  const youtube = platform === 'shorts';
  const boardLeft = youtube ? 66 : 45;
  const boardWidth = youtube ? 894 : 820;
  const caption = story.captions.filter(cue => cue.at <= timeMs).at(-1)?.text;
  const cameraWidth = youtube ? 680 : 640;
  return <AbsoluteFill style={{background:paper}}>
    <div style={{position:'absolute',width:1080,height:1920,transformOrigin:'top left',
      transform:`scale(${width/1080})`,color:ink,fontFamily:v2FontFamily,overflow:'hidden',
      backgroundColor:paper,backgroundImage:'radial-gradient(#d4d7cf 1.6px, transparent 1.8px)',backgroundSize:'32px 32px'}}>
      <Sequence durationInFrames={Math.round(presenterMs*fps/1000)} layout="none">
        <div style={{position:'absolute',top:94,left:(1080-cameraWidth)/2,width:cameraWidth,aspectRatio:'16 / 9',
          overflow:'hidden',borderRadius:12}}>
          <OffthreadVideo src={staticFile(`generated/010-binance/${story.slug}/presenter.mp4`)}
            style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'50% 44%'}}/>
        </div>
      </Sequence>
      {timeMs < presenterMs ? <>
        <div style={{position:'absolute',top:498,left:boardLeft+23,fontSize:36,color:'#1464ad',
          fontFamily:'"Comic Sans MS", cursive',transform:'rotate(-1deg)',opacity:arrive(timeMs,2100,400)}}>
          {typeof story.label === 'string' ? story.label : story.label(timeMs)}
        </div>
        {timeMs < 2350 && <div style={{position:'absolute',top:652,left:boardLeft+23,
          maxWidth:boardWidth-32,fontSize:64,fontWeight:800,lineHeight:1.22,opacity:1-arrive(timeMs,1950,350)}}>
          {story.hook}
        </div>}
        <div style={{position:'absolute',inset:0,opacity:arrive(timeMs,2150,400)}}>
          <Board time={timeMs} left={boardLeft} width={boardWidth}/>
        </div>
        {caption && <div style={{position:'absolute',top:youtube ? 1505 : 1455,left:boardLeft+6,
          maxWidth:boardWidth-22,display:'inline-block',background:'#242621',color:'white',
          fontSize:42,fontWeight:650,lineHeight:1.3,padding:'9px 21px 12px',borderRadius:9}}>
          {caption}
        </div>}
      </> : <EndCard platform={platform} elapsed={timeMs-presenterMs}/>}
    </div>
  </AbsoluteFill>;
}
