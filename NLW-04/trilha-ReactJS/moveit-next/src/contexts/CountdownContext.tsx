import {
  createContext, ReactNode, useContext, useEffect, useState,
} from 'react';
import { ChallengesContext } from './ChallengesContext';

interface CountdownContextData{
    minutes: number;
    seconds: number;
    isActive: boolean;
    hasFinished: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({

} as CountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export const CountdownProvider = ({ children }: CountdownProviderProps) => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const { startNewChallenge } = useContext(ChallengesContext);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const startCountdown = () => {
    setIsActive(true);
  };

  const resetCountdown = () => {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setTime(25 * 60);
    setHasFinished(false);
  };

  useEffect(
    () => {
      if (isActive && time > 0) {
        countdownTimeout = setTimeout(() => {
          setTime(time - 1);
        }, 1000);
      } else if (isActive && time === 0) {
        setHasFinished(true);
        setIsActive(false);
        startNewChallenge();
      }
    }, [isActive, time],
  );

  return (
    <CountdownContext.Provider value={{
      minutes,
      seconds,
      isActive,
      hasFinished,
      startCountdown,
      resetCountdown,
    }}
    >
      {children}
    </CountdownContext.Provider>
  );
};
