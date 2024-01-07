import express from 'express';

import verifyAuth from '../middleware/verifyAuth';

import { getPendingAlbum, setReleaseDate } from '../controller/releaseDateController';

const router = express.Router();

router.get('/', verifyAuth, getPendingAlbum);
router.post('/', verifyAuth, setReleaseDate);

export default router;

