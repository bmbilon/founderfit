/**
 * FounderFit Score v2.1: Login Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, isValidEmail } from '@/lib/auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
        color: 'white',
        padding: '40px',
        textAlign: 'center',
      }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome Back</h1>
        <p style={{ opacity: 0.9 }}>Log in to FounderFit Score™</p>
      </div>

      <div style={{ padding: '40px' }}>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="form-error" style={{
              padding: '12px',
              background: 'rgba(192, 21, 47, 0.1)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: 'var(--color-text-light)' }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ fontWeight: 600 }}>
                Sign up
              </Link>
            </p>
            <p style={{ marginTop: '12px' }}>
              <Link to="/" style={{ color: 'var(--color-text-light)' }}>
                ← Back to home
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
