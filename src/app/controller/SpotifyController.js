import 'dotenv/config'; // always first import

import dbQuery from '../db/dev/dbQuery';

import { SPOTIFY_API_URL } from '../common/settings';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import axios from '../helper/axios';

import { getLog } from '../util/log';

const log = getLog('SpotifyController');

export const getToken = async (req, res) => {
	log('getToken');
	try {
		const response = await axios.post(
			SPOTIFY_API_URL,
			{
				grant_type: 'client_credentials',
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
		// const query = `SELECT value FROM registry WHERE key LIKE 'client_secret';`;
		// const { rows } = await dbQuery.query(query);
		log('getToken', response);
		return res.status(status.success).send();
	} catch (error) {
		return buildError(log, 'getToken', error, res);
	}
};
