"use client"; // Ensures this component is rendered only on the client

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalSetup() {
  useEffect(() => {
    // Initialize OneSignal when the component mounts
    OneSignal.init({
      appId: "da95a5bc-8d18-460f-acef-55520f1cbc98", // Replace with your actual OneSignal App ID
      notifyButton: {
        enable: true, // Optional: shows the subscribe button
      },
      // Uncomment the next line if you're testing on localhost
      // allowLocalhostAsSecureOrigin: true,
    });
  }, []);

  return null;
}
