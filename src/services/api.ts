import axios from "axios";

const api = axios.create({
  baseURL:
    "https://my-json-server.typicode.com/NicolasOliveira861/plant-manager-app",
});

export default api;
