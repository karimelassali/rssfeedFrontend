import { useSearchParams } from 'next/navigation'

export default function News() {
  const searchParams = useSearchParams();
  const query = searchParams.get('id');

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">News {q}</h1>
    </div>
  );
}

