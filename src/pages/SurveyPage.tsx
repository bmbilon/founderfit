/**
 * FounderFit Score v2.1: Survey Page
 *
 * NOTE: This is a scaffold. Full survey implementation will be completed
 * once real questions are provided by the product team.
 */

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function SurveyPage() {
  const navigate = useNavigate();
  const { founder } = useAuth();

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '50px 40px',
        textAlign: 'center',
      }}>
        <h1 style={{ marginBottom: '12px' }}>FounderFit Assessment</h1>
        <p style={{ opacity: 0.95 }}>The 6 Execution Forces Framework</p>
        <div style={{
          marginTop: '24px',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.25)',
          borderRadius: '3px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'rgba(255, 255, 255, 0.9)',
            width: '0%',
            borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>
        <div style={{ marginTop: '12px', fontSize: '13px', opacity: 0.9 }}>
          <span>0</span> of <span>12</span> questions
        </div>
      </div>

      <div style={{ padding: '50px 40px', textAlign: 'center' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '40px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>
            Survey Implementation Pending
          </h2>
          <p style={{
            lineHeight: '1.6',
            color: 'var(--color-text-light)',
            marginBottom: '24px'
          }}>
            The full survey interface will be implemented once the product team provides
            the finalized question set mapping the 6 Execution Forces to specific assessment items.
          </p>
          <p style={{
            lineHeight: '1.6',
            color: 'var(--color-text)',
            marginBottom: '24px'
          }}>
            The survey will include:
          </p>
          <ul style={{
            textAlign: 'left',
            lineHeight: '1.8',
            color: 'var(--color-text-light)',
            marginBottom: '24px',
            listStyle: 'none',
            padding: 0
          }}>
            <li>✓ Binary choice questions</li>
            <li>✓ Likert scale (1-5) questions</li>
            <li>✓ Progress tracking</li>
            <li>✓ Previous/Next navigation</li>
            <li>✓ Auto-save to Supabase</li>
            <li>✓ Score calculation on completion</li>
          </ul>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              className="primary-button"
              onClick={() => {
                // future-proof: this becomes question index 0
                navigate('/survey/start');
              }}
            >
              Start Assessment
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Logged in as:</h3>
          <p style={{ color: 'var(--color-text-light)' }}>
            {founder?.name} ({founder?.email})
          </p>
        </div>
      </div>
    </div>
  );
}
