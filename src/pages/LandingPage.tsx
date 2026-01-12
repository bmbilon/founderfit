/**
 * FounderFit Score v2.1: Landing Page
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { EXECUTION_FORCES } from '@/types';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '60px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{ marginBottom: '12px', fontSize: '48px' }}>
          FounderFit Score™ v2.1
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.95, marginBottom: '8px' }}>
          The 6 Execution Forces Framework
        </p>
        <p style={{ fontSize: '15px', opacity: 0.85 }}>
          Longitudinal Founder Assessment Tool
        </p>
      </div>

      <div style={{ padding: '50px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
            Assess Your Execution Capacity
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--color-text-light)', maxWidth: '600px', margin: '0 auto' }}>
            FounderFit measures the six execution forces most correlated with founder success.
            Track your progress over time and compare outcomes across ventures.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {Object.values(EXECUTION_FORCES).map((force) => (
            <div
              key={force.id}
              style={{
                background: 'var(--color-bg-light)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                borderLeft: `4px solid var(--color-primary)`,
              }}
            >
              <div style={{
                fontWeight: 600,
                color: 'var(--color-primary)',
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Force {force.code}
              </div>
              <h3 style={{ marginBottom: '12px', fontSize: '18px' }}>
                {force.name}
              </h3>
              <p style={{
                fontSize: '14px',
                lineHeight: '1.5',
                color: 'var(--color-text-light)',
                marginBottom: '12px'
              }}>
                {force.description}
              </p>
              <p style={{
                fontSize: '13px',
                fontStyle: 'italic',
                color: 'var(--color-text-light)'
              }}>
                → {force.outcomeLink}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          padding: '40px',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '30px'
        }}>
          <h3 style={{
            textAlign: 'center',
            color: 'var(--color-primary)',
            marginBottom: '24px',
            fontSize: '22px'
          }}>
            What the Assessment Includes
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div style={{
              padding: '20px',
              background: 'var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '8px'
              }}>
                32
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                Total Questions
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-light)',
                marginTop: '8px'
              }}>
                24 scale-based + 8 scenario-based
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '8px'
              }}>
                10-12
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                Minutes to Complete
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-light)',
                marginTop: '8px'
              }}>
                Take your time, no rush
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: 'var(--color-bg-light)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                marginBottom: '8px'
              }}>
                6
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-light)' }}>
                Execution Forces
              </div>
              <div style={{
                fontSize: '13px',
                color: 'var(--color-text-light)',
                marginTop: '8px'
              }}>
                Comprehensive scoring breakdown
              </div>
            </div>
          </div>

          <div style={{
            padding: '24px',
            background: '#f0f9ff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #bfdbfe'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '12px',
              color: 'var(--color-text)'
            }}>
              Instructions
            </h4>
            <ul style={{
              fontSize: '14px',
              lineHeight: '1.8',
              color: 'var(--color-text)',
              paddingLeft: '20px',
              margin: 0
            }}>
              <li>Choose the answer that aligns most with you</li>
              <li>Don't overthink it—go with your instinct</li>
              <li>There are no wrong answers</li>
              <li>Answer honestly for the most accurate results</li>
            </ul>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          padding: '30px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginBottom: '16px' }}>Ready to get started?</h3>
          {user ? (
            <div>
              <button
                className="btn-primary"
                onClick={() => navigate('/survey')}
                style={{ marginRight: '12px' }}
              >
                Take Assessment
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </button>
            </div>
          ) : (
            <div>
              <button
                className="btn-primary"
                onClick={() => navigate('/signup')}
                style={{ marginRight: '12px' }}
              >
                Sign Up
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Log In
              </button>
            </div>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--color-text-light)'
        }}>
          <p>© 2026 FounderFit Score™. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
