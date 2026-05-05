import React, { useMemo, useState } from 'react';
import {
  validateFields,
  validateFile,
  MAX_FILE_SIZE,
} from '@shared/validation.js';
import FileDropzone from './components/FileDropzone.jsx';

const initialFormData = { name: '', message: '' };

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldsResult = useMemo(() => validateFields(formData), [formData]);
  const fileError = useMemo(() => validateFile(file), [file]);

  const errors = useMemo(() => {
    const merged = { ...fieldsResult.errors };
    if (fileError) merged.file = fileError;
    return { ...merged, ...serverErrors };
  }, [fieldsResult, fileError, serverErrors]);

  const isShown = (fieldName) => Boolean(touched[fieldName] || serverErrors[fieldName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (nextFile) => {
    setFile(nextFile);
    setTouched((prev) => ({ ...prev, file: true }));
    if (serverErrors.file) {
      setServerErrors((prev) => {
        const next = { ...prev };
        delete next.file;
        return next;
      });
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setFile(null);
    setTouched({});
    setServerErrors({});
    setResponse(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, message: true, file: true });

    if (!fieldsResult.success || fileError) {
      setError('Please fix the highlighted fields.');
      return;
    }

    setError(null);
    setResponse(null);
    setIsSubmitting(true);
    try {
      const body = new FormData();
      body.append('name', fieldsResult.data.name);
      body.append('message', fieldsResult.data.message);
      if (file) body.append('file', file);

      const res = await fetch('/api/submit', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) {
        if (data?.errors && typeof data.errors === 'object') {
          setServerErrors(data.errors);
        }
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
            Fill in the form, optionally attach a file, and submit it to the back-end.
          </p>
        </header>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <div className="form__field">
            <label className="form__label" htmlFor="name">Name</label>
            <input
              className={`form__input${isShown('name') && errors.name ? ' form__input--invalid' : ''}`}
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(isShown('name') && errors.name)}
              aria-describedby={isShown('name') && errors.name ? 'name-error' : undefined}
            />
            {isShown('name') && errors.name && (
              <span id="name-error" className="form__error">{errors.name}</span>
            )}
          </div>

          <div className="form__field">
            <label className="form__label" htmlFor="message">Message</label>
            <textarea
              className={`form__textarea${isShown('message') && errors.message ? ' form__textarea--invalid' : ''}`}
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(isShown('message') && errors.message)}
              aria-describedby={isShown('message') && errors.message ? 'message-error' : undefined}
            />
            {isShown('message') && errors.message && (
              <span id="message-error" className="form__error">{errors.message}</span>
            )}
          </div>

          <div className="form__field">
            <span className="form__label">Attachment</span>
            <FileDropzone
              file={file}
              onFileChange={handleFileChange}
              maxSize={MAX_FILE_SIZE}
              disabled={isSubmitting}
              hasError={Boolean(isShown('file') && errors.file)}
            />
            {isShown('file') && errors.file && (
              <span className="form__error">{errors.file}</span>
            )}
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
            {response.file?.path && (
              <p className="response__file">
                Stored file:
                {' '}
                <a
                  className="response__link"
                  href={response.file.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {response.file.path}
                </a>
              </p>
            )}
            <pre className="response__pre">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
