import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '@/data/questions';

export default function SurveyStartPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (QUESTIONS?.length) {
      // Start with demographics collection
      navigate('/survey/demographics', { replace: true });
    }
  }, [navigate]);

  // If no questions exist, show a sane fallback
  if (!QUESTIONS?.length) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Survey Questions Coming Next</h2>
        <p>
          The engine is wired. This will start the survey as soon as the item bank is finalized.
        </p>
        <button onClick={() => navigate('/survey')} style={{ marginTop: 16 }}>
          Back
        </button>
      </div>
    );
  }

  // While redirecting (very brief)
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Starting assessment…</h2>
    </div>
  );
}
