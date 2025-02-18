import http from 'k6/http';
import { sleep, check } from 'k6';

// This is where you define the number of virtual users and duration
export let options = {
  vus: 10,  // Virtual users
  duration: '30s',  // Duration of the test
};

export default function () {
  // Define the endpoint you want to test
  const res = http.get('http://localhost:3000');  // Replace with your app URL

  // Check the status of the response (optional)
  check(res, {
    'is status 200': (r) => r.status === 200,
  });

  // Sleep for a random time between requests to simulate real user behavior
  sleep(1);
}
