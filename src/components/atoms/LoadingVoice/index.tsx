import React from 'react';

interface LoadingVoiceProps {
  active?: boolean;
}

const LoadingVoice: React.FC<LoadingVoiceProps> = ({ active = true }) => (

  <div className="a-loadingVoice">
    {active ? (
      <>
        <span className="a-loadingVoice_shot" />
        <span className="a-loadingVoice_long" />
        <span className="a-loadingVoice_shot" />
        <span className="a-loadingVoice_long" />
        <span className="a-loadingVoice_shot" />
        <span className="a-loadingVoice_long" />
        <span className="a-loadingVoice_shot" />
      </>

    )
      : (
        <>
          <p className="a-loadingVoice_shot" />
          <p className="a-loadingVoice_long" />
          <p className="a-loadingVoice_shot" />
          <p className="a-loadingVoice_long" />
          <p className="a-loadingVoice_shot" />
          <p className="a-loadingVoice_long" />
          <p className="a-loadingVoice_shot" />
        </>
      )}
  </div>
);

LoadingVoice.defaultProps = {
};

export default LoadingVoice;
