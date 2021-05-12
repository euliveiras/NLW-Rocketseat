import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import { CountdownContext, CountdownProvider } from '../contexts/CountdownContext';

import styles from '../styles/components/ChallengeBox.module.css';

export const ChallengBox = () => {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(ChallengesContext);
  const { resetCountdown } = useContext(CountdownContext);

  const handleChallengeSucceeded = () => {
    completeChallenge();
    resetCountdown();
  };

  const handleChallengeFailed = () => {
    resetChallenge();
    resetCountdown();
  };

  return (
    <div className={styles.challengeBoxContainer}>
      { activeChallenge ? (
        <div className={styles.challengeActive}>
          <header>
            Ganhe
            { activeChallenge.amount }
            xp
          </header>
          <main>
            <img
              src={`icons/${activeChallenge.type}.svg`}
              alt=""
            />
            <strong>
              Novo desafio
            </strong>
            <p>
              { activeChallenge.description}
            </p>
          </main>
          <footer>
            <button type="button" onClick={handleChallengeFailed} className={styles.challengeFailedButton}>falhei</button>
            <button type="button" onClick={handleChallengeSucceeded} className={styles.challengeSucceededButton}>completei</button>
          </footer>
        </div>
      ) : (
        <div className={styles.challengeNotActive}>
          <strong>Finalize um ciclo para receber um desafio</strong>
          <p>
            <img src="icons/level-up.svg" alt="Level up" />
            Avance de level completando desafios
          </p>
        </div>
      )}
    </div>
  );
};
