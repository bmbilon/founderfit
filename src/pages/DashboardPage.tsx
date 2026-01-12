/**
 * FounderFit Score v2.1: Dashboard Page
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Assessment } from '@/types/database.types';
import { EXECUTION_FORCES, SCORE_BANDS } from '@/types';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { founder, isAdmin, signOut } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!founder?.id) return;

    // Fetch assessments for this founder
    const fetchAssessments = async () => {
      try {
        const { data, error } = await supabase
          .from('assessments')
          .select('*')
          .eq('founder_id', founder.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssessments(data || []);
      } catch (err) {
        console.error('Error fetching assessments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, [founder?.id]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const latestAssessment = assessments[0];
  const scoreBand = latestAssessment
    ? latestAssessment.overall_score >= 80
      ? SCORE_BANDS.exceptional
      : latestAssessment.overall_score >= 65
      ? SCORE_BANDS.strong
      : latestAssessment.overall_score >= 50
      ? SCORE_BANDS.average
      : SCORE_BANDS.developing
    : null;

  const handleDownloadPDF = async () => {
    if (!latestAssessment) return;

    // Generate PDF (simplified version - can be enhanced later)
    window.print();
  };

  const handleRequestConsultation = () => {
    // Open email or link to consultation form
    window.open('mailto:consulting@founderfit.com?subject=Request%20for%20Professional%20Feedback&body=Assessment%20ID:%20' + latestAssessment?.id, '_blank');
  };

  return (
    <div className="container">
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
          <p style={{ opacity: 0.9 }}>Welcome back, {founder?.name}</p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          Sign Out
        </button>
      </div>

      <div style={{ padding: '40px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading your assessments...</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              <div style={{
                background: 'var(--color-bg-light)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--color-primary)'
              }}>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Total Assessments</h3>
                <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  {assessments.length}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                  {assessments.length === 0 ? 'Start your first assessment' : 'Completed assessments'}
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-light)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--color-info)'
              }}>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Latest Score</h3>
                <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-info)' }}>
                  {latestAssessment ? latestAssessment.overall_score : '—'}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                  {latestAssessment && scoreBand ? scoreBand.label : 'No assessments yet'}
                </p>
              </div>

              <div style={{
                background: 'var(--color-bg-light)',
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                borderLeft: '4px solid var(--color-success)'
              }}>
                <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Ventures Tracked</h3>
                <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--color-success)' }}>
                  {new Set(assessments.filter(a => a.venture_id).map(a => a.venture_id)).size}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-light)', marginTop: '8px' }}>
                  Linked ventures
                </p>
              </div>
            </div>

            {latestAssessment && (
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <h2 style={{ fontSize: '20px', margin: 0 }}>Latest Assessment Report</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      className="btn-secondary"
                      onClick={handleDownloadPDF}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>📄</span> Download PDF
                    </button>
                    <button
                      className="btn-primary"
                      onClick={handleRequestConsultation}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <span>💬</span> Request Consultation
                    </button>
                  </div>
                </div>

                <div style={{
                  textAlign: 'center',
                  marginBottom: '32px',
                  padding: '24px',
                  background: 'var(--color-bg-light)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{
                    fontSize: '64px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    marginBottom: '12px'
                  }}>
                    {latestAssessment.overall_score}
                  </div>
                  {scoreBand && (
                    <div style={{
                      fontSize: '16px',
                      color: 'var(--color-text)',
                      marginBottom: '8px'
                    }}>
                      <strong>{scoreBand.label}:</strong> {scoreBand.description}
                    </div>
                  )}
                  <div style={{
                    fontSize: '13px',
                    color: 'var(--color-text-light)'
                  }}>
                    Completed {new Date(latestAssessment.created_at).toLocaleDateString()}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '18px',
                  marginBottom: '16px',
                  color: 'var(--color-primary)'
                }}>
                  Execution Force Breakdown
                </h3>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {Object.entries(EXECUTION_FORCES).map(([key, force]) => {
                    const forceKey = key as keyof typeof EXECUTION_FORCES;
                    const scoreKey = `force_${forceKey}` as keyof Assessment;
                    const forceScore = latestAssessment[scoreKey] as number;

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
                          fontSize: '13px'
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

                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: '#f0f9ff',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    lineHeight: '1.6'
                  }}>
                    <strong>Need deeper insights?</strong> Request a professional consultation to get personalized feedback,
                    identify blind spots, and receive actionable recommendations based on your assessment results.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          marginBottom: '20px'
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => navigate('/survey')}
            >
              Take Assessment
            </button>
            {isAdmin && (
              <button
                className="btn-secondary"
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        <div style={{
          background: 'var(--color-bg-light)',
          padding: '30px',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Assessment History</h2>
          {assessments.length === 0 ? (
            <p style={{ color: 'var(--color-text-light)', fontSize: '14px' }}>
              Your assessment history will appear here once you complete your first assessment.
              Track your progress over time and see how your execution forces evolve across
              different ventures.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assessments.map((assessment, index) => {
                const band = assessment.overall_score >= 80
                  ? SCORE_BANDS.exceptional
                  : assessment.overall_score >= 65
                  ? SCORE_BANDS.strong
                  : assessment.overall_score >= 50
                  ? SCORE_BANDS.average
                  : SCORE_BANDS.developing;

                return (
                  <div
                    key={assessment.id}
                    style={{
                      background: 'white',
                      padding: '20px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => navigate(`/results/${assessment.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '8px'
                      }}>
                        <div style={{
                          fontSize: '24px',
                          fontWeight: 700,
                          color: 'var(--color-primary)'
                        }}>
                          {assessment.overall_score}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600 }}>
                            {band.label}
                            {index === 0 && (
                              <span style={{
                                marginLeft: '8px',
                                padding: '2px 8px',
                                background: 'var(--color-primary)',
                                color: 'white',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700
                              }}>
                                LATEST
                              </span>
                            )}
                          </div>
                          <div style={{
                            fontSize: '13px',
                            color: 'var(--color-text-light)'
                          }}>
                            {new Date(assessment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn-secondary"
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/results/${assessment.id}`);
                      }}
                    >
                      View Report →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
