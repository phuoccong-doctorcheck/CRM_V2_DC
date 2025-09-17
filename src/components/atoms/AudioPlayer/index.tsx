/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { AudioPlayer as Audio } from 'react-audio-play';

interface AudioPlayerProps {
  audioSrc: string | any;
  duration: any;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioSrc, duration }) => {
  return (
    <div className="a-audio-player">
      <Audio
        src={audioSrc}
        width={300}
        backgroundColor='#fff'
      />
    </div>
  );
}

export default AudioPlayer;
