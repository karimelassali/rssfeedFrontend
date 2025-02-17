'use client';
import DigiNews from "@/components/diginews";
import OneSignalSetup from "@/components/oneSignalSetup";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-white">
      <OneSignalSetup />
      <DigiNews />
    </main>
  );
}