import pkg from 'pg';
import { config } from '../dbconfig.js';  // Asumido existente

const { Client } = pkg;

export async function executeQuery(query, params = []) {
  const client = new Client(config);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    throw error;  // Propaga el error para manejarlo en controller
  } finally {
    await client.end();
  }
}