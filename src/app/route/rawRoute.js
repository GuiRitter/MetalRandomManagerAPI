import express from 'express';

import { createAlbum, createArtist, createSong, getView } from '../controller/rawController';

import verifyAuth from '../middleware/verifyAuth';

const router = express.Router();

router.post('/album', verifyAuth, createAlbum);
router.post('/artist', verifyAuth, createArtist);
router.post('/song', verifyAuth, createSong);
router.get('/', verifyAuth, getView);

export default router;
