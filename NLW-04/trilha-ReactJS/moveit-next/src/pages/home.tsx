import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { useEffect } from 'react';
import Profile from '../components/Profile';
import { ExperienceBar } from '../components/ExperienceBar';
import styles from '../styles/pages/Home.module.css';
import CompletedChallenges from '../components/CompletedChallenges';
import Countdown from '../components/Countdown';
import { ChallengBox } from '../components/ChallengeBox';
import { CountdownProvider } from '../contexts/CountdownContext';
import { ChallengesProvider } from '../contexts/ChallengesContext';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  login: {
    name: string;
    avatarUrl: string;
  };
}

export default function Home({
  challengesCompleted,
  currentExperience,
  level,
  login,
}: HomeProps) {
  useEffect(() => window.history.replaceState({}, document.title, '/home'));

  return (
    <ChallengesProvider
      login={login}
      level={level}
      currentExperience={currentExperience}
      challengesCompleted={challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>
        <ExperienceBar />
        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
  const fetchData = async () => {
    try {
      const requestUrl = `https://github.com/login/oauth/access_token?client_id=4eddb43c271420fc8ee8&code=${query.code}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`;

      const firstRequest = await fetch(requestUrl, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
          Accept: 'application/json',
        },
      });

      const { access_token, token_type } = await firstRequest.json();

      if (access_token) {
        const bearer = `${token_type} ${access_token}`;

        const secondRequest = await fetch('https://api.github.com/user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Authorization: bearer,
          },
        });
        const data = await secondRequest.json();

        return data;
      }
      return null;
    } catch (err) {
      throw new Error(err);
    }
  };

  const {
    level, currentExperience, challengesCompleted, loginName, loginAvatar,
  } = req.cookies;

  const data = await fetchData();

  if (data) {
    const name = loginName || data.name;
    const avatarUrl = loginAvatar || data.avatar_url;

    return {
      props: {
        level: Number(level),
        currentExperience: Number(currentExperience),
        challengesCompleted: Number(challengesCompleted),
        login: {
          name,
          avatarUrl,
        },
      },
    };
  }

  const name = loginName || query.login;
  const avatarUrl = loginAvatar || query.avatarUrl;

  return {
    props: {
      level: Number(level),
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted),
      login: {
        name,
        avatarUrl,
      },
    },
  };
};
