import React from 'react';
import {
  describe, it, expect, beforeEach, afterEach, vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

const mockFetch = (response, init = {}) => {
  const fn = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => response,
  });
  globalThis.fetch = fn;
  return fn;
};

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    delete globalThis.fetch;
  });

  it('renders the form with name, message, and submit', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /form submission/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^submit$/i })).toBeInTheDocument();
  });

  it('shows an inline error after blurring an empty name field', async () => {
    const user = userEvent.setup();
    render(<App />);

    const nameInput = screen.getByLabelText(/name/i);
    await user.click(nameInput);
    await user.tab();

    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
  });

  it('blocks submission when the form is invalid and shows a banner', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({});
    render(<App />);

    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/fix the highlighted fields/i);
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/message is required/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits valid data and renders the response', async () => {
    const user = userEvent.setup();
    const fetchMock = mockFetch({ name: 'Alice', message: 'Hi', file: null });
    render(<App />);

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/message/i), 'Hi');
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/submit');
    expect(init.method).toBe('POST');
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.body.get('name')).toBe('Alice');
    expect(init.body.get('message')).toBe('Hi');

    expect(await screen.findByText(/Response/i)).toBeInTheDocument();
  });

  it('surfaces server-side field errors back into the form', async () => {
    const user = userEvent.setup();
    mockFetch(
      { message: 'Validation failed', errors: { name: 'Already taken' } },
      { ok: false, status: 400 },
    );
    render(<App />);

    await user.type(screen.getByLabelText(/name/i), 'Alice');
    await user.type(screen.getByLabelText(/message/i), 'Hi');
    await user.click(screen.getByRole('button', { name: /^submit$/i }));

    expect(await screen.findByText(/already taken/i)).toBeInTheDocument();
    expect(await screen.findByRole('alert')).toHaveTextContent(/validation failed/i);
  });
});
