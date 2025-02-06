import { useRouter } from 'next/navigation';

export default function News() {
  const router = useRouter();
  const { id } = router.;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">News {id}</h1>
    </div>
  );
}
