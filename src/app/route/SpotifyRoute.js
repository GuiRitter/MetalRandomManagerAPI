import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPlaylistList, getToken, login } from '../controller/SpotifyController';

const router = express.Router();

router.get('/login', verifyAuth, login);
router.get('/playlists', verifyAuth, getPlaylistList);
router.get('/token', getToken);

export default router;
