import Image from "next/image";
import axios from "axios";

export default function Home({ data }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export async function getServerSideProps() {
  const res = await axios.get("http://127.0.0.1:8000/api/data");
  const data = await res.data;

  return {
    props: {
      data,
    },
  };
}

