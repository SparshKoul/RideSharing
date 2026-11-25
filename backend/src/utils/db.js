/**
 * Database client
 */

import { Pool } from 'pg';
import { getDBConfig } from '../config/index.js';

export const db = new Pool(getDBConfig());

export const query = async (text, params = []) => {
  const result = await db.query(text, params);
  return result.rows;
};