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
      const encodedCode = encodeURIComponent(code);
      window.location.href = `https://zero-fitness01.netlify.app/dashboard?code=${encodedCode}`;
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