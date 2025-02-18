'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Head from 'next/head';
import DigiNews from "@/components/diginews";
import OneSignal from 'react-onesignal';
import Session from 'supertokens-auth-react/recipe/session';
import Link from 'next/link';

export default function Home() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      if (await Session.doesSessionExist()) {
        setIsLoggedIn(true);
        const session = await Session.getAccessTokenPayloadSecurely();
        setUserEmail(session.email);
      }
    };
    checkAuth();

    // Fetch data from API
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));

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
      <Head>
      </Head>
      <div className="bg-white p-4 shadow-sm">
        {isLoggedIn ? (
          <p className="text-gray-700">Hello, {userEmail}!</p>
        ) : (
          <div className="flex gap-2 items-center">
            <p className="text-gray-700">Please</p>
            <Link href="/auth" className="text-blue-600 hover:text-blue-800 underline">
              login
            </Link>
            <p className="text-gray-700">to access all features</p>
          </div>
        )}
      </div>
      <DigiNews />
    </div>
  );
}
