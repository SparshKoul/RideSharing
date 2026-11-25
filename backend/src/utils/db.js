/**
 * Supabase client for database operations
 */

import { getSupabaseClient } from '../config/index.js';

const supabase = getSupabaseClient();

export default supabase;

export const query = async (text, params = []) => {
  const { count, data } = await supabase.rpc('%s', ...params);
  return data;
};