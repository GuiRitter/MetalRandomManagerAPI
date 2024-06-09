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
			SPOTIFY.API_URL.TOKEN,
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
		const query = `UPDATE registry SET ´value´ = $1 WHERE ´key´ like $2 RETURNING ´key´;`;
		const { rows } = await dbQuery.query(query, [response[SPOTIFY.TOKEN.RESPONSE.DATA_KEY][SPOTIFY.TOKEN.RESPONSE.TOKEN_KEY], SPOTIFY.TOKEN.KEY]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getToken', error, res);
	}
};

export const getArtist = async (req, res) => {
	log('getArtist');
	try {
		const query = `SELECT ´value´ from registry WHERE ´key´ like $1;`;
		const token = (await dbQuery.query(query, [SPOTIFY.TOKEN.KEY]))[0]['´value´'];
		const response = await axios.get(
			SPOTIFY.API_URL.ARTIST,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}
		);
		return res.status(status.success).send(response);
	} catch (error) {
		return buildError(log, 'getArtist', error, res);
	}
};
