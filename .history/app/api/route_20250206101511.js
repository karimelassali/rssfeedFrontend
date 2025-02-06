import React from 'react';

export async function getStaticProps() {
  const res = await fetch('http://localhost:3000/api/data');
  const jsonData = await res.json();

  return {
    props: {
      data: jsonData.data,
    },
  };
}

const HomePage = ({ data }) => {
  return (
    <div>
      <h1>News Articles</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
            <p>Published on: {new Date(item.pubDate).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;