/**
 * FounderFit Score v2.1: Sign Up Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp, isValidEmail, isValidPassword, getPasswordStrengthMessage } from '@/lib/auth';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrengthMessage(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await signUp({ name: name.trim(), email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
        <h1 style={{ marginBottom: '8px' }}>Create Account</h1>
        <p style={{ opacity: 0.9 }}>Join FounderFit Score™</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Founder"
              required
              autoComplete="name"
              style={{ width: '100%' }}
            />
          </div>

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
              autoComplete="new-password"
              style={{ width: '100%' }}
            />
            {passwordStrength && (
              <div style={{
                fontSize: '12px',
                marginTop: '4px',
                color: password.length >= 12 ? 'var(--color-success)' : 'var(--color-text-light)'
              }}>
                {passwordStrength}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px' }}>
            <p style={{ color: 'var(--color-text-light)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ fontWeight: 600 }}>
                Log in
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
