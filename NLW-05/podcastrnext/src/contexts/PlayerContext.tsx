import React, { createContext, useContext, useState } from "react";

interface Episode {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

interface PlayerContextData {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play(episode: Episode): void;
  tooglePlay(): void;
  playNext(): void;
  playPrevious(): void;
  setPlayingState(state: boolean): void;
  playList(list: Episode[], index: number): void;
  hasPrevious: boolean;
  hasNext: boolean;
  toogleLoop(): void;
  isLooping: boolean;
  toogleShuffle(): void,
  isShuffling: boolean;
  clearPlayerState(): void;

}

const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider: React.FC = ({ children }) => {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  const play = (episode: Episode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true)
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const tooglePlay = () => {
    setIsPlaying(!isPlaying);
  }

  const toogleLoop = () => {
    setIsLooping(!isLooping);
  }

  const toogleShuffle = () => {
    setIsShuffling(!isShuffling);
  }

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  

  const playNext = () => {
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1 );

  };

  const playPrevious = () => {
    if(hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  };

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        tooglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        hasPrevious,
        hasNext,
        toogleLoop,
        isLooping,
        toogleShuffle,
        isShuffling,
        clearPlayerState
      }}>
      {children}
    </PlayerContext.Provider>
  )
};

export const usePlayerContext = () => {
  const context = useContext<PlayerContextData>(PlayerContext);

  return context;
}

