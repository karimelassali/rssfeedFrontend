'use client';
import { useEffect } from 'react';
import { redirectToAuth } from 'supertokens-auth-react';

export default function Auth() {
  useEffect(() => {
    redirectToAuth();
  }, []);

  return null;
}