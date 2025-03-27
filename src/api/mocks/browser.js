import { setupWorker } from 'msw/browser';

import { common_handler } from './common_handler';

import { api_handler } from './api_handler';

export const worker = setupWorker(...common_handler, ...api_handler);
