type TypeRinging = "start" | "stop";
let currentAudio = document.getElementById(
  "audio_missCall"
) as HTMLAudioElement;
let audioConnecting = document.getElementById(
  "audio_connecting"
) as HTMLAudioElement;

export const connectingAudio = (type: TypeRinging) => {
  if (window.location.pathname === "/monitor") return;

  if (audioConnecting && type === "start") {
    audioConnecting?.pause();
    (audioConnecting as any).currentTime = 0;
  }

  switch (type) {
    case "start":
      if (audioConnecting) {
        audioConnecting?.pause();
        (audioConnecting as any).currentTime = 0;
      }
      audioConnecting?.play();
      break;
    case "stop":
      audioConnecting?.pause();
      break;
  }
};

export const RingingAudio = (type: TypeRinging) => {
  if (window.location.pathname === "/monitor") return;

  if (currentAudio && type === "start") {
    currentAudio?.pause();
    (currentAudio as any).currentTime = 0;
  }

  switch (type) {
    case "start":
      if (currentAudio) {
        currentAudio?.pause();
        (currentAudio as any).currentTime = 0;
      }
      currentAudio.play();
      break;
    case "stop":
      currentAudio?.pause();
      (currentAudio as any).currentTime = 0;
      break;
  }
};
