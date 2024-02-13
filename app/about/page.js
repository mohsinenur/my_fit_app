"use client";

import { useEffect, useState } from 'react';

const AboutPage = () => {
  const [syncing, setSyncing] = useState(false);

  const handleSyncFitData = async () => {
    setSyncing(true);

    try {
      const response = await fetch('/api/googleFit');
      const data = await response.json(); // Parse the response as JSON

      console.log(data.authUrl);

      // Redirect the user to the authUrl
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('Error syncing Fit Data:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className='p-10 mt-10'>
      <h1>About Page</h1>
      <button onClick={handleSyncFitData} disabled={syncing}
      className='mt-10 bg-green-500 px-5 py-2'>
        {syncing ? 'Syncing...' : 'Sync Fit Data'}
      </button>
    </div>
  );
};

export default AboutPage;