// src/services/ServicioAPI.js
import { fetchDatos } from './api';

const ServicioAPI = {
  getData: () => fetchDatos(),
};

export default ServicioAPI;
