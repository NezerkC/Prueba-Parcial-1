// Guía 2.3.2 / 2.3.3: Pruebas de consumo de API y manejo de errores con Axios y vi.mock
import { describe, test, expect, vi } from 'vitest';
import axios from 'axios';
import { fetchDatos, fetchData } from './api';
import ServicioAPI from './ServicioAPI';

vi.mock('axios');

describe('Servicios API (Axios Mocks y Manejo de Errores)', () => {
  test('fetchDatos obtiene datos de usuario correctamente', async () => {
    const mockUser = { id: 1, name: 'Martín Gómez' };
    axios.get.mockResolvedValueOnce({ data: mockUser });

    const data = await fetchDatos();
    expect(data).toEqual(mockUser);
  });

  test('fetchData obtiene listado correctamente', async () => {
    const mockList = [{ id: 1, name: 'Martín Gómez' }];
    axios.get.mockResolvedValueOnce({ data: mockList });

    const data = await fetchData();
    expect(data).toHaveLength(1);
  });

  test('ServicioAPI.getData delega a fetchDatos', async () => {
    const mockUser = { id: 1, name: 'Camila Pérez' };
    axios.get.mockResolvedValueOnce({ data: mockUser });

    const data = await ServicioAPI.getData();
    expect(data.name).toBe('Camila Pérez');
  });

  test('maneja errores de red en la API correctamente', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error de red 500'));
    await expect(fetchDatos()).rejects.toThrow('Error de red 500');
  });
});
