import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getList, setStep } from '../controller/toDoController';

const router = express.Router();

router.get('/list', verifyAuth, getList);
router.post('/step', verifyAuth, setStep);

export default router;

