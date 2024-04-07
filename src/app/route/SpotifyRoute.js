import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getToken } from '../controller/SpotifyController';

const router = express.Router();

router.get('/', verifyAuth, getToken);

export default router;
