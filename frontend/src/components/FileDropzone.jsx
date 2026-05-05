import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes)) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(precision)} ${units[unitIndex]}`;
};

const FileDropzone = ({ file, onFileChange, maxSize, disabled }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileChange(acceptedFiles[0]);
      }
    },
    [onFileChange],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    onDrop,
    multiple: false,
    maxSize,
    disabled,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  const dropzoneClasses = [
    'dropzone',
    isDragActive ? 'dropzone--active' : '',
    isDragReject ? 'dropzone--reject' : '',
    disabled ? 'dropzone--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      {...getRootProps({ className: dropzoneClasses })}
      role="button"
      tabIndex={0}
      aria-label="File upload area"
    >
      <input {...getInputProps()} data-testid="file-input" />
      {file ? (
        <div className="dropzone__file">
          <div className="dropzone__file-info">
            <span className="dropzone__file-name">{file.name}</span>
            <span className="dropzone__file-meta">{formatBytes(file.size)}</span>
          </div>
          <div className="dropzone__file-actions">
            <button
              type="button"
              className="button button--ghost button--small"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              disabled={disabled}
            >
              Replace
            </button>
            <button
              type="button"
              className="button button--ghost button--small"
              onClick={handleRemove}
              disabled={disabled}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="dropzone__empty">
          <p className="dropzone__title">
            {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
          </p>
          <p className="dropzone__subtitle">
            or
            {' '}
            <button
              type="button"
              className="dropzone__browse"
              onClick={(e) => {
                e.stopPropagation();
                open();
              }}
              disabled={disabled}
            >
              browse
            </button>
            {' '}
            from your computer
          </p>
          {maxSize && (
            <p className="dropzone__hint">{`Max ${formatBytes(maxSize)}`}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
