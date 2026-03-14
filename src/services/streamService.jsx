// services/streamService.js
import api from "./api"; 

const STREAM_URL_PREFIX = '/streams'; 
const GAMES_URL_PREFIX = '/games'; 

const streamService = {
  // 1. Get My Stream (Dashboard)
  getMyStream: async () => {
    const response = await api.get(`${STREAM_URL_PREFIX}/my-stream/`);
    return response.data;
  },

  // 2. Create Stream (First Time Setup)
  createStream: async () => {
    const response = await api.post(`${STREAM_URL_PREFIX}/create-stream/`);
    return response.data;
  },

  // 3. Reset Key (Security)
  resetStreamKey: async () => {
    const response = await api.post(`${STREAM_URL_PREFIX}/regenerate-key/`);
    return response.data;
  },

  // 4. Get ALL Live Streams (Home Page) -- THIS WAS MISSING
  getLiveStreams: async () => {
    const response = await api.get(`${STREAM_URL_PREFIX}/live/`);
    return response.data;
  },

  // 5. Get Single Stream (Watch Page) -- THIS WAS MISSING
  getStreamById: async (id) => {
    const response = await api.get(`${STREAM_URL_PREFIX}/${id}/`);
    return response.data;
  },

  // 6. Update Stream Info (Go Live / Edit Title)
  updateStream: async (data) => {
    const response = await api.patch(`${STREAM_URL_PREFIX}/my-stream/update/`, data);
    return response.data;
  },

  // 7. Search Games (Dropdown)
  searchGames: async (query) => {
    const response = await api.get(`${GAMES_URL_PREFIX}/search/?q=${query}`);
    return response.data;
  }
};

export default streamService;