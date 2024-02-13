"use client"

import { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [isRedirectedToHome, setIsRedirectedToHome] = useState(false);

  useEffect(() => {
    // Check if the URL has the 'code' parameter
    const authorizationCode = new URLSearchParams(window.location.search).get('code');

    if (authorizationCode) {
      // If the 'code' parameter is present, handle it (e.g., make a request to your API)
      handleAuthorizationCode(authorizationCode);
    }
  }, []);

  const handleAuthorizationCode = async (code) => {
    try {
      const response = await fetch(`/api/googleFit/callback?code=${code}`);
      const data = await response.json();
      console.log(data);
      if (data.isRedirectedToHome) {
        setIsRedirectedToHome(true);
        // Remove the 'code' parameter from the URL
        const urlWithoutCode = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, urlWithoutCode);
      } else {
        setFitnessData(data.data);
      }
    } catch (error) {
      console.error('Error fetching fitness data:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard Page</h1>

      {isRedirectedToHome ? (
        <p>Successfully redirected to home page</p>
      ) : fitnessData ? (
        <div>
          <h2>Fitness Data:</h2>
          <pre>{JSON.stringify(fitnessData, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardPage;