'use client';
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