import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getArtist, getToken } from '../controller/SpotifyController';

const router = express.Router();

router.get('/token', verifyAuth, getToken);
router.get('/test', verifyAuth, getArtist);

export default router;
