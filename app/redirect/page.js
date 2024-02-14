"use client"

import { useState, useEffect } from 'react';

const RedirectPage = () => {

  useEffect(() => {
    const authorizationCode = new URLSearchParams(window.location.search).get('code');

    if (authorizationCode) {
      handleAuthorizationCode(authorizationCode);
    }
  }, []);

  const handleAuthorizationCode = async (code) => {
    try {
      // Redirect to the desired URL with the authorization code
      window.location.href = `https://zero-fitness01.netlify.app/dashboard?code=${code}`;
    } catch (error) {
      console.error('Redirect failed:', error);
    }
  };

  return (
    <div>
      
    </div>
  );
};

export default RedirectPage;