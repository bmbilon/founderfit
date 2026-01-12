/**
 * FounderFit Score v2.1: Demographics Collection Page
 *
 * Collects background information for scoring enhancement.
 * Framed neutrally as "Background Information" - NO mention of scoring weights.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMOGRAPHIC_QUESTIONS, type DemographicAnswers, validateDemographicAnswers } from '@/data/demographics';
import { setSurveyStartTime } from '@/utils/assessmentSubmission';

function getStorageKey() {
  return 'founderfit:demographics:draft:v2.1';
}

function loadDraft(): Partial<DemographicAnswers> {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveDraft(draft: Partial<DemographicAnswers>) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export default function DemographicsPage() {
  const navigate = useNavigate();
  const [responses, setResponses] = useState<Partial<DemographicAnswers>>(() => loadDraft());

  // Set survey start time when demographics page is first loaded
  useEffect(() => {
    setSurveyStartTime();
  }, []);

  const isComplete = validateDemographicAnswers(responses);

  const setResponse = (field: keyof DemographicAnswers, value: string) => {
    setResponses((prev) => {
      const next = { ...prev, [field]: value };
      saveDraft(next);
      return next;
    });
  };

  const handleContinue = () => {
    if (!isComplete) return;
    // Navigate to first question
    navigate('/survey/q/0');
  };

  const handleBack = () => {
    navigate('/survey');
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.kicker}>FounderFit Assessment</div>
          <h1 style={styles.h1}>Founder Background</h1>
          <p style={styles.subtitle}>
            Help us understand your context. This information shapes how we interpret your assessment results.
          </p>
        </div>

        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>Step 1 of 2</div>
          <div style={styles.progressOuter}>
            <div style={{ ...styles.progressInner, width: '50%' }} />
          </div>
        </div>

        <div style={styles.questionsContainer}>
          {DEMOGRAPHIC_QUESTIONS.map((question, idx) => {
            const currentValue = responses[question.id];
            const isAnswered = !!currentValue;

            return (
              <div key={question.id} style={styles.questionBlock}>
                <label style={styles.questionLabel}>
                  <span style={styles.questionNumber}>{idx + 1}.</span> {question.label}
                  {!isAnswered && <span style={styles.required}>*</span>}
                </label>
                {question.helperText && (
                  <p style={styles.helperText}>{question.helperText}</p>
                )}

                <div style={styles.optionsGrid}>
                  {question.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setResponse(question.id, option.value)}
                      style={{
                        ...styles.optionButton,
                        ...(currentValue === option.value ? styles.optionButtonSelected : {}),
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {!isComplete && (
          <div style={styles.notice}>
            Please answer all questions to continue.
          </div>
        )}

        <div style={styles.navRow}>
          <button onClick={handleBack} style={{ ...styles.btn, ...styles.btnSecondary }}>
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!isComplete}
            style={{
              ...styles.btn,
              ...styles.btnPrimary,
              opacity: isComplete ? 1 : 0.5,
              cursor: isComplete ? 'pointer' : 'not-allowed',
            }}
          >
            Continue to Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '60px 16px',
    background: 'linear-gradient(180deg, #eef3f8 0%, #e7eef6 100%)',
  },
  card: {
    width: 'min(900px, 100%)',
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  header: {
    marginBottom: 24,
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.7,
    marginBottom: 8,
  },
  h1: {
    margin: 0,
    fontSize: 32,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  subtitle: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.5,
    color: '#64748b',
  },
  progressSection: {
    marginBottom: 32,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 8,
    color: '#475569',
  },
  progressOuter: {
    height: 10,
    borderRadius: 999,
    background: '#edf2f7',
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    borderRadius: 999,
    background: '#1f8a70',
    transition: 'width 180ms ease',
  },
  questionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    marginBottom: 24,
  },
  questionBlock: {
    paddingBottom: 28,
    borderBottom: '1px solid #e2e8f0',
  },
  questionLabel: {
    display: 'block',
    fontSize: 17,
    fontWeight: 500,
    marginBottom: 14,
    color: '#0f172a',
  },
  questionNumber: {
    color: '#1f8a70',
    fontWeight: 600,
  },
  required: {
    color: '#dc2626',
    marginLeft: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 1.4,
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 10,
  },
  optionButton: {
    padding: '12px 16px',
    borderRadius: 10,
    border: '2px solid #d7dee8',
    background: '#fff',
    fontSize: 15,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 120ms ease',
  },
  optionButtonSelected: {
    borderColor: '#1f8a70',
    background: 'rgba(31,138,112,0.08)',
    fontWeight: 500,
  },
  notice: {
    marginTop: 16,
    marginBottom: 16,
    padding: '12px 16px',
    borderRadius: 12,
    background: '#fff5f5',
    border: '1px solid #fed7d7',
    color: '#b91c1c',
    fontSize: 14,
    textAlign: 'center',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTop: '1px solid #e2e8f0',
  },
  btn: {
    padding: '12px 20px',
    borderRadius: 12,
    border: '1px solid transparent',
    fontSize: 15,
    fontWeight: 600,
  },
  btnPrimary: {
    background: '#1f8a70',
    color: '#fff',
  },
  btnSecondary: {
    background: '#f3f6fb',
    color: '#0f172a',
    borderColor: '#d7dee8',
    cursor: 'pointer',
  },
};
