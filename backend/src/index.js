import { config } from 'dotenv';
import path from 'path';
import { createApp } from './app.js';

config({ path: path.join(import.meta.dirname, '../../.env') });

const { BACKEND_PORT } = process.env;
const app = createApp();

// eslint-disable-next-line no-console
app.listen(BACKEND_PORT, () => console.log(`Server running on port ${BACKEND_PORT}`));
