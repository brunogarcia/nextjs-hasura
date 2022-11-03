import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HASURA_URL,
  timeout: 1000,
  headers: {
    "x-hasura-role": "anonymous",
    "Content-type": "application/json",
  },
});

export default http;
