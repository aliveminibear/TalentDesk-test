import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileDropzone from './FileDropzone.jsx';

describe('FileDropzone', () => {
  it('renders the empty state with hint text', () => {
    render(
      <FileDropzone file={null} onFileChange={() => {}} maxSize={1024 * 1024} />,
    );
    expect(screen.getByText(/drag & drop a file here/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
    expect(screen.getByText(/Max 1\.0 MB/i)).toBeInTheDocument();
  });

  it('renders the selected file and its size', () => {
    const file = { name: 'photo.png', size: 2048 };
    render(
      <FileDropzone file={file} onFileChange={() => {}} maxSize={1024 * 1024} />,
    );
    expect(screen.getByText('photo.png')).toBeInTheDocument();
    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /replace/i })).toBeInTheDocument();
  });

  it('calls onFileChange(null) when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const onFileChange = vi.fn();
    const file = { name: 'photo.png', size: 2048 };
    render(
      <FileDropzone file={file} onFileChange={onFileChange} maxSize={1024 * 1024} />,
    );

    await user.click(screen.getByRole('button', { name: /remove/i }));
    expect(onFileChange).toHaveBeenCalledWith(null);
  });
});
