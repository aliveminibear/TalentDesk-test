import fs from 'fs';
import path from 'path';
import {
  describe, it, expect, beforeEach, afterAll,
} from 'vitest';
import request from 'supertest';
import { createApp, UPLOADS_DIR } from '../src/app.js';

const cleanUploads = () => {
  if (!fs.existsSync(UPLOADS_DIR)) return;
  fs.readdirSync(UPLOADS_DIR).forEach((file) => {
    if (file === '.gitkeep') return;
    fs.unlinkSync(path.join(UPLOADS_DIR, file));
  });
};

describe('POST /api/submit', () => {
  let app;

  beforeEach(() => {
    cleanUploads();
    app = createApp();
  });

  afterAll(cleanUploads);

  it('returns 200 with the submitted fields when valid', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Alice')
      .field('message', 'Hello');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: 'Alice', message: 'Hello', file: null });
  });

  it('trims fields before responding', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', '  Alice  ')
      .field('message', '  Hi  ');

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice');
    expect(res.body.message).toBe('Hi');
  });

  it('returns 400 with field errors when name is empty', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', '')
      .field('message', 'Hi');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors.name).toMatch(/required/i);
  });

  it('returns 400 with field errors when message is empty', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Alice')
      .field('message', '');

    expect(res.status).toBe(400);
    expect(res.body.errors.message).toMatch(/required/i);
  });

  it('stores an uploaded file and serves it back via /uploads', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Alice')
      .field('message', 'See attached')
      .attach('file', Buffer.from('hello world'), 'note.txt');

    expect(res.status).toBe(200);
    expect(res.body.file).toMatchObject({
      originalName: 'note.txt',
      mimeType: 'text/plain',
      size: 11,
    });
    expect(res.body.file.path).toMatch(/^\/uploads\//);

    const onDisk = path.join(UPLOADS_DIR, res.body.file.storedName);
    expect(fs.existsSync(onDisk)).toBe(true);

    const served = await request(app).get(res.body.file.path);
    expect(served.status).toBe(200);
    expect(served.text).toBe('hello world');
  });

  it('removes the uploaded file when validation fails', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', '')
      .field('message', 'Body')
      .attach('file', Buffer.from('orphan'), 'orphan.txt');

    expect(res.status).toBe(400);
    const remaining = fs
      .readdirSync(UPLOADS_DIR)
      .filter((file) => file !== '.gitkeep');
    expect(remaining).toHaveLength(0);
  });

  it('sanitizes the original filename when storing on disk', async () => {
    const res = await request(app)
      .post('/api/submit')
      .field('name', 'Alice')
      .field('message', 'Hi')
      .attach('file', Buffer.from('x'), 'weird name with spaces!.txt');

    expect(res.status).toBe(200);
    expect(res.body.file.storedName).not.toMatch(/[\s!]/);
    expect(res.body.file.storedName).toMatch(/\.txt$/);
  });
});
