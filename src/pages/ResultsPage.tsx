/**
 * FounderFit Score v2.1: Results Page
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { EXECUTION_FORCES, SCORE_BANDS } from '@/types';
import type { Assessment } from '@/types/database.types';
import { fetchAssessmentResults } from '@/utils/assessmentSubmission';
import type { DemographicAnswers } from '@/data/demographics';
import { buildWeightProfile } from '@/utils/weighting';
import type { AssessmentMetadata, NarrativeSnapshot } from '@/types/assessment.types';

export default function ResultsPage() {
  const navigate = useNavigate();
  const { assessmentId } = useParams();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      setError('No assessment ID provided');
      setLoading(false);
      return;
    }

    fetchAssessmentResults(assessmentId)
      .then((data) => {
        setAssessment(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading assessment:', err);
        setError('Failed to load assessment results');
        setLoading(false);
      });
  }, [assessmentId]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Loading your results...</h2>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Error Loading Results</h2>
        <p>{error || 'Assessment not found'}</p>
        <button className="btn-primary" onClick={() => navigate('/survey')}>
          Take Assessment
        </button>
      </div>
    );
  }

  const score = assessment.overall_score;
  const forceScores = {
    thesis_integrity: assessment.force_thesis_integrity,
    learning_velocity: assessment.force_learning_velocity,
    decision_quality_under_load: assessment.force_decision_quality,
    talent_gravity: assessment.force_talent_gravity,
    delivery_control: assessment.force_delivery_control,
    resilience_economics: assessment.force_resilience_economics,
  };

  // Determine score band and interpretation
  const scoreBand =
    score >= 80
      ? SCORE_BANDS.exceptional
      : score >= 65
      ? SCORE_BANDS.strong
      : score >= 50
      ? SCORE_BANDS.average
      : SCORE_BANDS.developing;

  // Extract metadata for auditability
  const metadata = assessment.metadata as AssessmentMetadata | undefined;

  // Prefer persisted narrative snapshot over recomputation
  // This ensures results remain auditable even if weighting logic changes
  let narrative: NarrativeSnapshot | null = null;
  let scoringModelVersion: string | null = null;

  if (metadata?.narrative && metadata?.weight_profile) {
    // Use persisted snapshot (preferred for auditability)
    narrative = metadata.narrative;
    scoringModelVersion = metadata.weight_profile.version;
    console.log('[ResultsPage] Using persisted narrative snapshot from:', scoringModelVersion);
  } else if (metadata?.demographics) {
    // Fallback: recompute from demographics (backward compatibility)
    const demographics = metadata.demographics as DemographicAnswers;
    narrative = buildWeightProfile(demographics).narrative;
    console.log('[ResultsPage] Recomputing narrative from demographics (no snapshot found)');
  }

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '40px',
        textAlign: 'center',
      }}>
        <h1>Your FounderFit Score</h1>
      </div>

      <div style={{ padding: '50px 40px', textAlign: 'center' }}>
        <div className="fade-in">
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            marginBottom: '20px'
          }}>
            {score}
          </div>

          <div style={{
            fontSize: '18px',
            lineHeight: '1.6',
            color: 'var(--color-text)',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px'
          }}>
            <strong>{scoreBand.label}:</strong> {scoreBand.description}
          </div>

          <h3 style={{
            color: 'var(--color-primary)',
            marginBottom: '24px',
            fontSize: '20px'
          }}>
            Execution Force Breakdown
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            marginBottom: '30px'
          }}>
            {Object.entries(EXECUTION_FORCES).map(([key, force]) => {
              const forceScore = forceScores[key as keyof typeof forceScores];
              return (
                <div
                  key={force.id}
                  style={{
                    background: 'var(--color-bg-light)',
                    padding: '20px',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '4px solid var(--color-primary)'
                  }}
                >
                  <div style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: '8px',
                    fontSize: '14px'
                  }}>
                    {force.name}
                  </div>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}>
                    {forceScore}
                  </div>
                </div>
              );
            })}
          </div>

          {narrative && (
            <div style={{
              marginTop: '48px',
              padding: '32px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}>
                <h3 style={{
                  color: 'var(--color-primary)',
                  margin: 0,
                }}>
                  Your Founder Context
                </h3>
                {scoringModelVersion && (
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: 500,
                    padding: '4px 10px',
                    background: '#fff',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                  }}>
                    Scoring model: {scoringModelVersion}
                  </div>
                )}
              </div>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                fontSize: '15px',
                lineHeight: '1.6',
              }}>
                {narrative.cofounderContext && (
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Team Structure
                    </div>
                    <div style={{ color: '#475569' }}>
                      {narrative.cofounderContext}
                    </div>
                  </div>
                )}

                {narrative.ageContext && (
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Career Stage
                    </div>
                    <div style={{ color: '#475569' }}>
                      {narrative.ageContext}
                    </div>
                  </div>
                )}

                {narrative.industryExperienceContext && (
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Industry Experience
                    </div>
                    <div style={{ color: '#475569' }}>
                      {narrative.industryExperienceContext}
                    </div>
                  </div>
                )}

                {narrative.priorExitsContext && (
                  <div>
                    <div style={{
                      fontWeight: 600,
                      color: '#0f172a',
                      marginBottom: '8px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Founder Experience
                    </div>
                    <div style={{ color: '#475569' }}>
                      {narrative.priorExitsContext}
                    </div>
                  </div>
                )}
              </div>

              <div style={{
                marginTop: '24px',
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#64748b',
                borderLeft: '3px solid #1f8a70',
              }}>
                <strong>Note:</strong> This context is separate from your execution score above.
                It helps frame your results within your specific founder journey and circumstances.
              </div>
            </div>
          )}

          <div style={{ marginTop: '30px' }}>
            <button
              className="btn-primary"
              onClick={() => navigate('/dashboard')}
              style={{ marginRight: '12px' }}
            >
              View Dashboard
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/survey')}
            >
              Take Another Assessment
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '16px',
          background: 'var(--color-bg-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '13px',
          color: 'var(--color-text-light)'
        }}>
          Assessment ID: {assessmentId || 'mock-assessment-id'}
        </div>
      </div>
    </div>
  );
}
