/**
 * FounderFit Score v2.1
 * Health Gate Component - Validates Supabase connectivity before allowing app access
 */

import React, { useEffect, useState } from 'react';
import {
  runHealthCheckWithTimeout,
  HealthStatus,
  type HealthCheckResult,
} from '@/lib/healthCheck';
import './HealthGate.css';

interface HealthGateProps {
  children: React.ReactNode;
}

export function HealthGate({ children }: HealthGateProps) {
  const [healthResult, setHealthResult] = useState<HealthCheckResult>({
    status: HealthStatus.CHECKING,
  });
  const [retrying, setRetrying] = useState(false);

  const runCheck = async () => {
    setHealthResult({ status: HealthStatus.CHECKING });
    const result = await runHealthCheckWithTimeout(10000);
    setHealthResult(result);
    setRetrying(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  // If healthy, render the app
  if (healthResult.status === HealthStatus.HEALTHY) {
    return <>{children}</>;
  }

  // Otherwise, show appropriate error screen
  return (
    <div className="health-gate">
      <div className="health-gate-content">
        {healthResult.status === HealthStatus.CHECKING && (
          <CheckingScreen retrying={retrying} />
        )}

        {healthResult.status === HealthStatus.CONFIG_ERROR && (
          <ConfigErrorScreen error={healthResult.error} />
        )}

        {healthResult.status === HealthStatus.CONNECTION_ERROR && (
          <ConnectionErrorScreen
            error={healthResult.error}
            details={healthResult.details}
            onRetry={() => {
              setRetrying(true);
              runCheck();
            }}
            retrying={retrying}
          />
        )}
      </div>
    </div>
  );
}

function CheckingScreen({ retrying }: { retrying: boolean }) {
  return (
    <>
      <div className="health-icon health-icon-checking">
        <div className="spinner" />
      </div>
      <h1 className="health-title">
        {retrying ? 'Retrying Connection...' : 'Starting FounderFit...'}
      </h1>
      <p className="health-message">
        {retrying
          ? 'Attempting to reconnect to Supabase...'
          : 'Checking Supabase connectivity...'}
      </p>
    </>
  );
}

function ConfigErrorScreen({ error }: { error?: string }) {
  return (
    <>
      <div className="health-icon health-icon-error">⚠️</div>
      <h1 className="health-title">Configuration Error</h1>
      <p className="health-message">{error}</p>
      <div className="health-instructions">
        <p className="health-instructions-title">To fix this:</p>
        <ol>
          <li>
            Create a <code>.env</code> file in the project root
          </li>
          <li>
            Add your Supabase credentials:
            <pre>
              VITE_SUPABASE_URL=https://your-project.supabase.co{'\n'}
              VITE_SUPABASE_ANON_KEY=your-anon-key
            </pre>
          </li>
          <li>Restart the development server</li>
        </ol>
        <p className="health-help">
          See <code>SETUP_GUIDE.md</code> for detailed instructions.
        </p>
      </div>
    </>
  );
}

interface ConnectionErrorScreenProps {
  error?: string;
  details?: {
    configValid: boolean;
    authReachable: boolean;
    databaseReachable: boolean;
  };
  onRetry: () => void;
  retrying: boolean;
}

function ConnectionErrorScreen({
  error,
  details,
  onRetry,
  retrying,
}: ConnectionErrorScreenProps) {
  return (
    <>
      <div className="health-icon health-icon-offline">🔌</div>
      <h1 className="health-title">Cannot Reach Backend</h1>
      <p className="health-message">{error}</p>

      {details && (
        <div className="health-diagnostics">
          <div className="health-diagnostic-item">
            <span className="health-diagnostic-label">Configuration:</span>
            <span
              className={`health-diagnostic-status ${
                details.configValid ? 'status-ok' : 'status-error'
              }`}
            >
              {details.configValid ? '✓ Valid' : '✗ Invalid'}
            </span>
          </div>
          <div className="health-diagnostic-item">
            <span className="health-diagnostic-label">Auth Service:</span>
            <span
              className={`health-diagnostic-status ${
                details.authReachable ? 'status-ok' : 'status-error'
              }`}
            >
              {details.authReachable ? '✓ Reachable' : '✗ Unreachable'}
            </span>
          </div>
          <div className="health-diagnostic-item">
            <span className="health-diagnostic-label">Database:</span>
            <span
              className={`health-diagnostic-status ${
                details.databaseReachable ? 'status-ok' : 'status-error'
              }`}
            >
              {details.databaseReachable ? '✓ Reachable' : '✗ Unreachable'}
            </span>
          </div>
        </div>
      )}

      <button
        className="health-retry-button"
        onClick={onRetry}
        disabled={retrying}
      >
        {retrying ? 'Retrying...' : 'Retry Connection'}
      </button>

      <div className="health-instructions">
        <p className="health-instructions-title">Possible causes:</p>
        <ul>
          <li>No internet connection</li>
          <li>Supabase is down or unreachable</li>
          <li>Firewall blocking connection</li>
          <li>Invalid Supabase URL or key</li>
        </ul>
      </div>
    </>
  );
}
