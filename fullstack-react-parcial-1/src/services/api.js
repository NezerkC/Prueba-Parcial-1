// src/services/api.js
// Capa de servicio HTTP con Axios (Guías 2.3.2 y 2.3.3)
import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

export async function fetchDatos() {
  const respuesta = await axios.get(`${API_URL}/1`);
  return respuesta.data;
}

export async function fetchData() {
  const respuesta = await axios.get(API_URL);
  return respuesta.data;
}
