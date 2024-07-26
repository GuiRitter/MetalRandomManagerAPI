import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPendingSpotifyId, getPlaylistList, getToken, login, populatePendingId, setSpotifyId } from '../controller/SpotifyController';

const router = express.Router();

router.get('/login', verifyAuth, login);
router.get('/pending_id', verifyAuth, getPendingSpotifyId);
router.get('/playlists', verifyAuth, getPlaylistList);
router.get('/token', getToken);
router.post('/pending_id', verifyAuth, setSpotifyId);
router.post('/populate_pending_id', verifyAuth, populatePendingId);

export default router;
