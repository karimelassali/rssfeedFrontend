// lib/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
  timeout: 1000,
  headers: { 'Content-Type': 'application/json' }
});

export default instance;