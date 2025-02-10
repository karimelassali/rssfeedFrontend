import { useEffect } from 'react';

const initOneSignal = () => {
  const OneSignal = window.OneSignal || [];
  OneSignal.push(() => {
    OneSignal.init({
      appId: 'da95a5bc-8d18-460f-acef-55520f1cbc98',
      allowLocalhostAsSecureOrigin: true,
    });
  });
};

export default initOneSignal;