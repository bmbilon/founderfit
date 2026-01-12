/**
 * FounderFit Score v2.1
 * Supabase Health Check & Connection Validation
 */

import { supabase } from './supabase';

export enum HealthStatus {
  HEALTHY = 'healthy',
  CONFIG_ERROR = 'config_error',
  CONNECTION_ERROR = 'connection_error',
  CHECKING = 'checking',
}

export interface HealthCheckResult {
  status: HealthStatus;
  error?: string;
  details?: {
    configValid: boolean;
    authReachable: boolean;
    databaseReachable: boolean;
  };
}

/**
 * Validate environment variables are present
 */
export function validateConfig(): { valid: boolean; error?: string } {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return {
      valid: false,
      error: 'Missing Supabase configuration. Please check your environment variables.',
    };
  }

  // Basic URL validation
  try {
    new URL(url);
  } catch {
    return {
      valid: false,
      error: 'Invalid VITE_SUPABASE_URL format. Must be a valid URL.',
    };
  }

  // Basic key validation (should be a JWT-like string)
  if (key.length < 100) {
    return {
      valid: false,
      error: 'VITE_SUPABASE_ANON_KEY appears invalid. Should be a long JWT token.',
    };
  }

  return { valid: true };
}

/**
 * Check if we can reach Supabase auth service
 */
async function checkAuthReachable(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.getSession();
    // Even if there's no session, if we don't get a connection error, auth is reachable
    return !error || error.message.includes('session') || error.message.includes('user');
  } catch (err) {
    console.error('Auth check failed:', err);
    return false;
  }
}

/**
 * Check if we can query the database
 * Uses a lightweight query to a view that should always exist
 */
async function checkDatabaseReachable(): Promise<boolean> {
  try {
    // Try to query the founders table (should be accessible via RLS even if no data)
    const { error } = await supabase
      .from('founders')
      .select('id')
      .limit(1)
      .maybeSingle();

    // If we get an RLS error or no rows, that's fine - it means we can reach the database
    // Only connection errors are a problem
    if (error) {
      // RLS errors, not found errors are OK - they mean we connected
      const connectionErrors = ['fetch', 'network', 'timeout', 'ECONNREFUSED'];
      const isConnectionError = connectionErrors.some((term) =>
        error.message.toLowerCase().includes(term.toLowerCase())
      );
      return !isConnectionError;
    }

    return true;
  } catch (err) {
    console.error('Database check failed:', err);
    return false;
  }
}

/**
 * Run a comprehensive health check
 * Returns status and details about what failed
 */
export async function runHealthCheck(): Promise<HealthCheckResult> {
  // Step 1: Validate config
  const configCheck = validateConfig();
  if (!configCheck.valid) {
    return {
      status: HealthStatus.CONFIG_ERROR,
      error: configCheck.error,
      details: {
        configValid: false,
        authReachable: false,
        databaseReachable: false,
      },
    };
  }

  // Step 2: Check connectivity
  try {
    const [authReachable, databaseReachable] = await Promise.all([
      checkAuthReachable(),
      checkDatabaseReachable(),
    ]);

    if (!authReachable || !databaseReachable) {
      return {
        status: HealthStatus.CONNECTION_ERROR,
        error: 'Cannot reach Supabase services. Please check your internet connection.',
        details: {
          configValid: true,
          authReachable,
          databaseReachable,
        },
      };
    }

    return {
      status: HealthStatus.HEALTHY,
      details: {
        configValid: true,
        authReachable: true,
        databaseReachable: true,
      },
    };
  } catch (err: any) {
    return {
      status: HealthStatus.CONNECTION_ERROR,
      error: err.message || 'Unknown connection error',
      details: {
        configValid: true,
        authReachable: false,
        databaseReachable: false,
      },
    };
  }
}

/**
 * Run health check with timeout
 */
export async function runHealthCheckWithTimeout(
  timeoutMs: number = 10000
): Promise<HealthCheckResult> {
  return Promise.race([
    runHealthCheck(),
    new Promise<HealthCheckResult>((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: HealthStatus.CONNECTION_ERROR,
            error: 'Health check timed out. Supabase may be unreachable.',
            details: {
              configValid: true,
              authReachable: false,
              databaseReachable: false,
            },
          }),
        timeoutMs
      )
    ),
  ]);
}
