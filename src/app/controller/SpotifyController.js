import 'dotenv/config'; // always first import

import dbQuery from '../db/dev/dbQuery';

import { SPOTIFY } from '../common/settings';

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
			SPOTIFY.API_URL,
			{
				grant_type: 'client_credentials',
				client_id: process.env.SPOTIFY_CLIENT_ID,
				client_secret: process.env.SPOTIFY_CLIENT_SECRET
			},
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
		const query = `INSERT INTO registry (key, value) VALUES ($1, $2) RETURNING key;`;
		const { rows } = await dbQuery.query(query, [SPOTIFY.TOKEN.KEY, response[SPOTIFY.TOKEN.RESPONSE.DATA_KEY][SPOTIFY.TOKEN.RESPONSE.TOKEN_KEY]]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getToken', error, res);
	}
};
