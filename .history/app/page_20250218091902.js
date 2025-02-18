'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import Head from 'next/head';
import DigiNews from "@/components/diginews";
import OneSignal from 'react-onesignal';

// Authentication removed




export default function Home() {
  const { data: session } = useSession(); 
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  // if (session) {
  //   return (
  //     <>
  //       Signed in as {session.user.email} <br />
  //       <button onClick={() => signOut()}>Sign out</button>
  //     </>
  //   )
  // }

  useEffect(() => {
    // Fetch data from API
    axios.get('api/test')
      .then(response => setData(response.data))
      .catch(error => console.error(error));


         // Ensure this code runs only on the client side
        if (typeof window !== 'undefined') {
          OneSignal.init({
            appId: 'e8dd6f91-e21d-4a9c-bab4-f8440b7d63b0',
            // You can add other initialization options here
            notifyButton: {
              enable: true,
            },
            // Uncomment the below line to run on localhost. See: https://documentation.onesignal.com/docs/local-testing
            // allowLocalhostAsSecureOrigin: true
          });
        }

  }, []);

  return (
    <div className="w-full h-full">
      <Head>
        {/* OneSignal SDK is dynamically imported */}
      </Head>
      <DigiNews />
    </div>
  );
}
