import express from 'express';

import { getDone } from '../controller/musicController';

const router = express.Router();

router.get('/list', getDone);

export default router;

