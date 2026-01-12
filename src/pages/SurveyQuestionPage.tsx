import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QUESTIONS } from '@/data/questions';
import { submitAssessment } from '@/utils/assessmentSubmission';

type AnswerValue = number; // binary: 0/1, likert: 1-5

function getStorageKey() {
  return 'founderfit:survey:draft:v2.1';
}

function loadDraft(): Record<string, AnswerValue> {
  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveDraft(draft: Record<string, AnswerValue>) {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(draft));
  } catch {
    // ignore
  }
}

export default function SurveyQuestionPage() {
  const navigate = useNavigate();
  const { index } = useParams();

  const i = Number(index);
  const total = QUESTIONS?.length ?? 0;

  const [draft, setDraft] = useState<Record<string, AnswerValue>>(() => loadDraft());
  const [showValidationError, setShowValidationError] = useState(false);

  const q = useMemo(() => {
    if (!Number.isFinite(i) || i < 0 || i >= total) return null;
    return QUESTIONS[i] as any;
  }, [i, total]);

  // Hard guards (never blank)
  if (!Number.isFinite(i)) {
    return (
      <PageShell title="Invalid route">
        <p>Question index is not valid.</p>
        <PrimaryButton onClick={() => navigate('/survey')}>Back to Survey</PrimaryButton>
      </PageShell>
    );
  }

  if (!total) {
    return (
      <PageShell title="No questions loaded">
        <p>
          Your question bank is empty. Add placeholders (or real items) in <code>src/data/questions.ts</code>.
        </p>
        <PrimaryButton onClick={() => navigate('/survey')}>Back to Survey</PrimaryButton>
      </PageShell>
    );
  }

  if (!q) {
    return (
      <PageShell title="Question out of range">
        <p>
          Requested question {i + 1} of {total}.
        </p>
        <PrimaryButton onClick={() => navigate('/survey/q/0')}>Go to Question 1</PrimaryButton>
      </PageShell>
    );
  }

  const questionId: string = q.id ?? `q_${i}`;
  const questionType: 'binary' | 'likert' | 'multiple-choice' = q.type ?? 'likert';
  const currentValue = draft[questionId];

  const setAnswer = (val: AnswerValue) => {
    setShowValidationError(false); // Clear validation error when answer is selected
    setDraft((prev) => {
      const next = { ...prev, [questionId]: val };
      saveDraft(next);
      return next;
    });
  };

  const answered = typeof currentValue === 'number';

  const goNext = async () => {
    console.log('[SurveyQuestionPage] goNext called', {
      answered,
      currentIndex: i,
      total,
      isLastQuestion: i >= total - 1,
    });

    if (!answered) {
      console.log('[SurveyQuestionPage] Question not answered, showing validation error');
      setShowValidationError(true);
      return;
    }

    if (i >= total - 1) {
      // Last question - submit assessment
      console.log('[SurveyQuestionPage] Last question reached, submitting assessment...');

      try {
        console.log('[SurveyQuestionPage] Calling submitAssessment (founder ID will be resolved from auth)');

        const { assessmentId } = await submitAssessment();

        console.log('[SurveyQuestionPage] ✅ Assessment submitted successfully!', assessmentId);
        console.log('[SurveyQuestionPage] Navigating to results page...');
        navigate(`/results/${assessmentId}`);
      } catch (error) {
        console.error('[SurveyQuestionPage] ❌ Failed to submit assessment:', error);
        alert('Failed to submit assessment. Please try again.');
      }
      return;
    }

    console.log('[SurveyQuestionPage] Moving to next question:', i + 1);
    navigate(`/survey/q/${i + 1}`);
  };

  const goPrev = () => {
    if (i <= 0) {
      navigate('/survey');
      return;
    }
    navigate(`/survey/q/${i - 1}`);
  };

  const progressPct = Math.round(((i + 1) / total) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.kicker}>FounderFit Assessment</div>
            <h1 style={styles.h1}>
              Question {i + 1} / {total}
            </h1>
          </div>
          <div style={styles.meta}>
            <div><strong>Force:</strong> {q.force}</div>
            <div><strong>Type:</strong> {questionType}</div>
          </div>
        </div>

        <div style={styles.progressOuter} aria-label="progress">
          <div style={{ ...styles.progressInner, width: `${progressPct}%` }} />
        </div>

        <div style={styles.questionText}>{q.text}</div>

        <div style={{ marginTop: 24 }}>
          {questionType === 'binary' ? (
            <div style={styles.answerRow}>
              <ChoiceButton selected={currentValue === 1} onClick={() => setAnswer(1)}>
                Yes
              </ChoiceButton>
              <ChoiceButton selected={currentValue === 0} onClick={() => setAnswer(0)}>
                No
              </ChoiceButton>
            </div>
          ) : questionType === 'multiple-choice' ? (
            <div style={styles.multipleChoiceContainer}>
              {q.options?.map((opt: any) => (
                <ChoiceButton
                  key={opt.value}
                  selected={currentValue === opt.value}
                  onClick={() => setAnswer(opt.value)}
                >
                  {opt.text}
                </ChoiceButton>
              ))}
            </div>
          ) : (
            <div>
              <div style={styles.likertRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <LikertButton key={n} selected={currentValue === n} onClick={() => setAnswer(n)}>
                    {n}
                  </LikertButton>
                ))}
              </div>
              <div style={styles.likertLabels}>
                <div style={styles.likertLabel}>Strongly Disagree</div>
                <div style={styles.likertLabel}>Somewhat Disagree</div>
                <div style={styles.likertLabel}>Neutral</div>
                <div style={styles.likertLabel}>Somewhat Agree</div>
                <div style={styles.likertLabel}>Strongly Agree</div>
              </div>
            </div>
          )}
        </div>

        {showValidationError && (
          <div style={styles.notice}>
            Please select an answer to continue.
          </div>
        )}

        <div style={styles.navRow}>
          <SecondaryButton onClick={goPrev}>{i === 0 ? 'Back' : 'Previous'}</SecondaryButton>
          <PrimaryButton onClick={goNext} disabled={false}>
            {i === total - 1 ? 'Finish' : 'Next'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/** Minimal UI helpers (no extra files) */

function PageShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.h1}>{title}</h1>
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.btn,
        ...styles.btnPrimary,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{ ...styles.btn, ...styles.btnSecondary }}>
      {children}
    </button>
  );
}

function ChoiceButton({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.choiceBtn,
        borderColor: selected ? '#1f8a70' : '#d7dee8',
        background: selected ? 'rgba(31,138,112,0.08)' : '#fff',
      }}
    >
      {children}
    </button>
  );
}

function LikertButton({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.likertBtn,
        borderColor: selected ? '#1f8a70' : '#d7dee8',
        background: selected ? 'rgba(31,138,112,0.12)' : '#fff',
      }}
    >
      {children}
    </button>
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
    width: 'min(860px, 100%)',
    background: '#fff',
    borderRadius: 16,
    padding: 32,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
  },
  headerRow: {
    display: 'flex',
    gap: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  kicker: {
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  h1: {
    margin: '6px 0 0 0',
    fontSize: 28,
    lineHeight: 1.15,
  },
  meta: {
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 1.5,
    textAlign: 'right',
  },
  progressOuter: {
    height: 10,
    borderRadius: 999,
    background: '#edf2f7',
    overflow: 'hidden',
    marginTop: 18,
  },
  progressInner: {
    height: '100%',
    borderRadius: 999,
    background: '#1f8a70',
    transition: 'width 180ms ease',
  },
  questionText: {
    marginTop: 20,
    fontSize: 18,
    lineHeight: 1.5,
  },
  answerRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
  },
  multipleChoiceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  choiceBtn: {
    padding: '14px 18px',
    borderRadius: 12,
    border: '2px solid #d7dee8',
    fontSize: 16,
    cursor: 'pointer',
    minWidth: 120,
  },
  likertRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  likertBtn: {
    minWidth: 52,
    height: 52,
    borderRadius: 12,
    border: '2px solid #d7dee8',
    fontSize: 18,
    cursor: 'pointer',
    fontWeight: 600,
    flex: '0 0 auto',
  },
  likertLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    width: '100%',
  },
  likertLabel: {
    flex: '0 0 auto',
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 1.3,
    textAlign: 'center',
    maxWidth: 70,
  },
  notice: {
    marginTop: 16,
    padding: '10px 14px',
    borderRadius: 8,
    background: '#fff5f5',
    border: '1px solid #fed7d7',
    color: '#b91c1c',
    fontSize: 14,
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 28,
  },
  btn: {
    padding: '12px 16px',
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
