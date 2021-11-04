import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import styles from '../styles/pages/Login.module.css';

declare global {
  interface Window {
    fbAsyncInit: () => any;
  }
}

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (window) {
      window.fbAsyncInit = () => {
        FB.init({
          appId: `${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`,
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v12.0',
        });
      };
    }
  }, []);

  const handleFbLogin = () => {
    FB.login(() => FB.api('/me', { fields: 'name, picture' }, async (loginResponse) => {
      JSON.stringify(loginResponse);
      console.log(loginResponse);
      const { name, picture } = loginResponse;
      const data = { name, picture: picture.data.url };

      const dataFetched = await fetch("/api/saveuser", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
      });

      const dataFormatted = await dataFetched.json();

      console.log("olá", dataFormatted);
      router.push({
        pathname: '/home',
        query: { login: name, avatarUrl: picture.data.url },
      });
    }));
  };

  return (
    <>
      <Head>
        <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
      </Head>
      <div className={styles.loginContainer}>
        <div className={styles.loginAreaContainer}>
          <h1>dontbelazy app</h1>
          <div className={styles.loginButtonsContainer}>
            <Link
              href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
            >
              <button type="button">
                Log in com github
                <img src="icons/github-seeklogo.com.svg" alt="logo github" />
              </button>
            </Link>
            <span>Or</span>
            <button type="button" onClick={() => handleFbLogin()}>
              Login com facebook
            </button>
          </div>
        </div>
      </div>
    </>
  )
};

export default LandingPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { loginName, loginAvatar } = req.cookies;
  if (loginName && loginAvatar !== undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    };
  }
  return {
    props: {},
  };
};
