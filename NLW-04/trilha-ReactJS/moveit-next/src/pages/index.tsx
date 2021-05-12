import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import sdkLoader from '../../utils/facebookSdkLoader';

import styles from '../styles/components/Login.module.css';

interface LandingPageProps {
  handleFbLogin(): void;
}

const LandingPage = ({ handleFbLogin }: LandingPageProps) => (

  <>
    <Head>
      <script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js" />
    </Head>
    <div className={styles.loginContainer}>
      <div className={styles.loginAreaContainer}>
        <h1>dontbelazy app</h1>
        <div className={styles.loginButtonsContainer}>
          <Link
            href="https://github.com/login/oauth/authorize?client_id=4eddb43c271420fc8ee8"
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
);

export default sdkLoader(LandingPage);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { loginName, loginAvatar } = ctx.req.cookies;
  if (loginName && loginAvatar !== undefined) {
    return {
      redirect: {
        permanent: false,
        destination: '/home',
      },
    };
  }
  return {
    props: {

    },
  };
};
