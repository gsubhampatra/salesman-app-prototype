import { AppConfig } from "./AppConfig";

const BASE_URL = `${AppConfig.BACKEND_URL}`;
// const BASE_URL = 'http://192.168.29.226:3000';

// Define the API routes in a structured way
export const API_ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/api/user/login`,
    ME: `${BASE_URL}/api/user/me`,
  },
  LOCATION: {
    CREATE_VISITED_LOCATION: `${BASE_URL}/api/user/visit/location`,
    GET_VISITED_LOCATIONS: `${BASE_URL}/api/user/get/my/visited/location`
  }
} as const;