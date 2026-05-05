import React, { useState } from 'react';

const initialFormData = { name: '', message: '' };

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Submission failed');
      }
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app">
      <section className="card" aria-labelledby="form-title">
        <header className="card__header">
          <h1 id="form-title" className="card__title">Form Submission</h1>
          <p className="card__subtitle">
            Fill in the form and submit it to the back-end.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__field">
            <label className="form__label" htmlFor="name">Name</label>
            <input
              className="form__input"
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="message">Message</label>
            <textarea
              className="form__textarea"
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="form__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={handleReset}
              disabled={isSubmitting}
            >
              Reset
            </button>
            <button
              type="submit"
              className="button button--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert--error" role="alert">{error}</div>
        )}

        {response && (
          <div className="response" aria-live="polite">
            <h2 className="response__title">Response</h2>
            <pre className="response__pre">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
