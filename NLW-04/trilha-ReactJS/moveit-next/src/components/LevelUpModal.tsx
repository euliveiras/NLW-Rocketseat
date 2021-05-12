import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/LevelUpModal.module.css';

export const LevelUpModal = () => {
  const { level, closeLevelUpModal } = useContext(ChallengesContext);
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header>{level}</header>
        <strong>parabéns</strong>
        <p>vc alcançou um novo lvl</p>
        <button
          type="button"
          onClick={closeLevelUpModal}
        >
          <img
            src="/icons/close.svg"
            alt="Fechar modal"
          />
        </button>
      </div>
    </div>
  );
};
