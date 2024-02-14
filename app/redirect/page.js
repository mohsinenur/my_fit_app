"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    const authorizationCode = new URLSearchParams(window.location.search).get('code');

    if (authorizationCode) {
      handleAuthorizationCode(authorizationCode);
    }
  }, []);

  const handleAuthorizationCode = async (code) => {
    try {
      router.push(`https://zero-fitness01.netlify.app/dashboard?code=${code}`);

    } catch (error) {
      console.error('Redirect failed.:', error);
    }
  };

  return (
    <div>
      
    </div>
  );
};

export default RedirectPage;