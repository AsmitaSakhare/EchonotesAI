// src/lib/api.ts
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5167";
export const api = axios.create({ baseURL: API_BASE });
