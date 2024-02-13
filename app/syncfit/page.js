"use client";
import { useEffect } from 'react';
//  import { google } from 'googleapis';

const SyncFit = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: '553686057416-9qbhtoi9k427a1d0lfn4la2neqnu3tkk.apps.googleusercontent.com',
        });
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const auth2 = await window.gapi.auth2.getAuthInstance();
      const user = await auth2.signIn();

      const authResponse = user.getAuthResponse();
      const accessToken = authResponse.access_token;

      // Now you have the accessToken
      console.log('Access Token:', accessToken);

      // You can set the accessToken in the state or call a function to handle it
      //handleAccessToken(accessToken);
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  // const handleAccessToken = (accessToken) => {
  //   // Handle the accessToken, e.g., set it in state or call a function
  //   // to make API requests using the googleapis library
  //   google.options({
  //     auth: accessToken,
  //   });
  // };

  return (
    <div>
      <h1>About Page</h1>
      <div className="g-signin2" data-onsuccess={handleSignIn}></div>
    </div>
  );
};

export default SyncFit;