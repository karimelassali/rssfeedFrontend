'use client';
import DigiNews from './components/DigiNews'
import OneSignal from 'react-onesignal';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window !== 'undefined') {
      OneSignal.init({
        appId: 'e8dd6f91-e21d-4a9c-bab4-f8440b7d63b0',
        notifyButton: {
          enable: true,
        },
      });
    }
  }, []);
  return ( 
    <div className="w-full h-full">
      <DigiNews />
    </div>
  );
}