/**
 * Audit service
 */

import { query } from '../utils/db.js';

/**
 * Log an audit event
 */
export const logAudit = (eventType, tableName, recordId, payload) => {
  await query('INSERT INTO audit_log (event_type, table_name, record_id, payload) VALUES ($1, $2, $3, $4)', [eventType, tableName, recordId, JSON.stringify(payload)]);
};

/**
 * Get audit log entries
 */
export const getAuditLog = (limit = 50) => {
  const result = await query('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT $1', [limit]);
  return result.rows;
};