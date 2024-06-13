import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPlaylistList, getToken } from '../controller/SpotifyController';

const router = express.Router();

router.get('/token', verifyAuth, getToken);
router.get('/playlists', verifyAuth, getPlaylistList);

export default router;
