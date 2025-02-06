/*************  ✨ Codeium Command 🌟  *************/
import { useRouter } from 'next/router';


export default function News() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">News {id}</h1>
      <h1 className="text-4xl font-bold">News</h1>
    </div>
  );
}
/******  3f5f49cc-e7e7-49fc-b620-87d0c65a9742  *******/