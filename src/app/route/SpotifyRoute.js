import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPendingSpotifyId, getPlaylistList, getToken, login, setSpotifyId } from '../controller/SpotifyController';

const router = express.Router();

router.get('/login', verifyAuth, login);
router.get('/pending_id', verifyAuth, getPendingSpotifyId);
router.get('/playlists', verifyAuth, getPlaylistList);
router.get('/token', getToken);
router.post('/pending_id', verifyAuth, setSpotifyId);

export default router;
