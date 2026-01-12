/**
 * FounderFit Score v2.1: Admin Page
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { EXECUTION_FORCES } from '@/types';

export default function AdminPage() {
  const navigate = useNavigate();
  const { founder } = useAuth();

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '30px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <h1 style={{ fontSize: '24px', margin: 0 }}>
          Administrator Panel - FounderFit Score™ v2.1
        </h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Close
        </button>
      </div>

      <div style={{
        maxWidth: 'var(--admin-panel-max-width)',
        margin: '0 auto',
        padding: '40px 30px'
      }}>
        <div style={{
          marginBottom: '40px',
          background: 'var(--color-bg-light)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          borderLeft: '4px solid var(--color-primary)'
        }}>
          <h2 style={{
            marginTop: 0,
            color: 'var(--color-primary)',
            fontSize: '20px',
            borderBottom: '2px solid var(--color-border)',
            paddingBottom: '15px',
            marginBottom: '20px'
          }}>
            System Overview
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Total Founders</p>
              <p style={{ fontSize: '24px', color: 'var(--color-primary)' }}>0</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Total Assessments</p>
              <p style={{ fontSize: '24px', color: 'var(--color-primary)' }}>0</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Active Ventures</p>
              <p style={{ fontSize: '24px', color: 'var(--color-primary)' }}>0</p>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '4px' }}>Success Exits</p>
              <p style={{ fontSize: '24px', color: 'var(--color-success)' }}>0</p>
            </div>
          </div>
        </div>

        <div style={{
          marginBottom: '40px',
          background: 'var(--color-bg-light)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          borderLeft: '4px solid var(--color-primary)'
        }}>
          <h2 style={{
            marginTop: 0,
            color: 'var(--color-primary)',
            fontSize: '20px',
            borderBottom: '2px solid var(--color-border)',
            paddingBottom: '15px',
            marginBottom: '20px'
          }}>
            The 6 Execution Forces Framework
          </h2>

          {Object.values(EXECUTION_FORCES).map((force) => (
            <div
              key={force.id}
              style={{
                background: 'white',
                padding: '20px',
                marginBottom: '16px',
                borderRadius: 'var(--radius-md)',
                borderLeft: '4px solid var(--color-primary)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    marginBottom: '4px'
                  }}>
                    Force {force.code}
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    color: 'var(--color-text)'
                  }}>
                    {force.name}
                  </h3>
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--color-text-light)'
                }}>
                  —
                </div>
              </div>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'var(--color-text)',
                marginBottom: '8px'
              }}>
                {force.description}
              </p>
              <p style={{
                fontSize: '13px',
                fontStyle: 'italic',
                color: 'var(--color-text-light)'
              }}>
                <strong>Outcome linkage:</strong> {force.outcomeLink}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          marginBottom: '40px',
          background: 'var(--color-bg-light)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          borderLeft: '4px solid var(--color-primary)'
        }}>
          <h2 style={{
            marginTop: 0,
            color: 'var(--color-primary)',
            fontSize: '20px',
            marginBottom: '16px'
          }}>
            Cohort Analysis
          </h2>
          <p style={{
            color: 'var(--color-text-light)',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            Cohort analysis features will display aggregated statistics, correlations between
            execution force scores and venture outcomes, and longitudinal trends. Data will
            populate as assessments and venture outcomes are recorded.
          </p>
        </div>

        <div style={{
          background: 'var(--color-bg-light)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{
            marginTop: 0,
            color: 'var(--color-primary)',
            fontSize: '20px',
            marginBottom: '16px'
          }}>
            Database Schema
          </h2>
          <p style={{
            color: 'var(--color-text)',
            fontSize: '14px',
            lineHeight: '1.6',
            marginBottom: '12px'
          }}>
            The database schema has been designed for longitudinal analysis:
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            fontSize: '14px',
            lineHeight: '1.8',
            color: 'var(--color-text-light)'
          }}>
            <li>✓ <strong>founders</strong> - Founder profiles linked to auth</li>
            <li>✓ <strong>assessments</strong> - Assessment scores and metadata</li>
            <li>✓ <strong>assessment_responses</strong> - Individual question responses</li>
            <li>✓ <strong>ventures</strong> - Venture tracking with outcomes</li>
            <li>✓ <strong>Views</strong> - Pre-built cohort analysis and history views</li>
          </ul>
          <p style={{
            marginTop: '16px',
            fontSize: '13px',
            color: 'var(--color-text-light)'
          }}>
            Logged in as: <strong>{founder?.name}</strong> ({founder?.role})
          </p>
        </div>
      </div>
    </div>
  );
}
