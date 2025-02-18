'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Head from 'next/head';
import DigiNews from "@/components/diginews";
import OneSignal from 'react-onesignal';

export default function Home() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
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
      <DigiNews />
    </div>
  );
}
