import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"
//
import { usePlayerContext } from "../../contexts/PlayerContext";
import styles from "./styles.module.scss";
import convertDurationToTimeString from "../../utils/convertDurationToTimeString";
//
const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    tooglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toogleLoop,
    toogleShuffle,
    isShuffling,
    clearPlayerState
  } = usePlayerContext();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setUpProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  const handleEpisodeEnded = () => {
    if(hasNext){
      playNext();
    }else{
      clearPlayerState()
    };
  };

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>tocando agora</strong>
      </header>
      {episode
        ? (
          <div className={styles.currentEpisode}>
            <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        )
        : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>)}

      < footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{
                  backgroundColor: "#04d361"
                }}
                onChange={(e) => handleSeek(e)}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
              />
            )
              : (
                <div className={styles.emptySlider} />
              )
            }
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            onEnded={() => handleEpisodeEnded()}
            onLoadedMetadata={() => setUpProgressListener()}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}
        <div className={styles.buttons} >
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={() => toogleShuffle()}
            className={isShuffling ? styles.isActive : ""}
          >
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
            <img src="/play-previous.svg" alt="tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButtons}
            disabled={!episode}
            onClick={() => tooglePlay()}>
            {isPlaying
              ? <img src="/pause.svg" />
              : <img src="/play.svg" alt="tocar" />
            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
            <img src="/play-next.svg" alt="tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={() => toogleLoop()}
            className={isLooping ? styles.isActive : ""}
          >
            <img src="/repeat.svg" alt="repetir" />
          </button>
        </div>
      </footer>
    </div >
  )
};

export default Player;