import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';

declare global {
    interface Window {
        FB:any;
        fbAsyncInit: () => any;
    }
}

interface WrapperProps{
    handleFbLogin(): void;
}

const sdkLoader = (WrappedComponent: React.ElementType) => {
  const wrapper = (props: WrapperProps) => {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
      window.fbAsyncInit = () => {
        const { FB } = window;
        FB.init({
          appId: '181345900463114',
          autoLogAppEvents: true,
          xfbml: true,
          version: 'v10.0',
        });
      };
      setIsSDKLoaded(true);
    }, []);

    const handleFbLogin = useCallback(() => {
      if (window) {
        const { FB } = window;
        FB.login(() => FB.api('/me', { fields: 'name, picture, id' }, (loginResponse) => {
          JSON.stringify(loginResponse);
          const { name } = loginResponse;
          const { picture } = loginResponse;
          router.push({
            pathname: '/home',
            query: { login: name, avatarUrl: picture.data.url },
          });
        }));
      }
    }, [isSDKLoaded]);

    return <WrappedComponent handleFbLogin={handleFbLogin} />;
  };

  return wrapper;
};

export default sdkLoader;
