import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPendingTrackNumber, setTrackNumber } from '../controller/trackNumberController';

const router = express.Router();

router.get('/', verifyAuth, getPendingTrackNumber);
router.post('/', verifyAuth, setTrackNumber);

export default router;

