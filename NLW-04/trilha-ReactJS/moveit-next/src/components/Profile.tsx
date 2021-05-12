import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengesContext';
import styles from '../styles/components/Profile.module.css';

const Profile = () => {
  const { level, login } = useContext(ChallengesContext);
  return (
    <div className={styles.profileContainer}>
      <img src={login.avatarUrl} alt={login.avatarUrl} />
      <div>
        <strong>{login.name}</strong>
        <p>
          <img src="icons/level.svg" alt="level" />
          Level
          {' '}
          {level}
        </p>
      </div>
    </div>
  );
};

export default Profile;
