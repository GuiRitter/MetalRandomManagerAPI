import express from 'express';

import { getPage } from '../controller/artistController';

const router = express.Router();

router.get('/page', getPage);

export default router;

