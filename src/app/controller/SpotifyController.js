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
			SPOTIFY.URL.API.TOKEN,
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

export const getPlaylistList = async (req, res) => {
	log('getPlaylistList');
	try {
		const query = `SELECT ´value´ from registry WHERE ´key´ like $1;`;
		const token = (await dbQuery.query(query, [SPOTIFY.TOKEN.KEY])).rows[0]['´value´'];
		const response = await axios.get(
			// Gonna need this instead https://developer.spotify.com/documentation/web-api/tutorials/code-flow
			SPOTIFY.URL.API.PLAYLIST_LIST,
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}
		);
		return res.status(status.success).send(response.data);
	} catch (error) {
		return buildError(log, 'getPlaylistList', error, res);
	}
};


export const login = async (req, res) => {
	log('login');
	try {
		const query = `UPDATE ´user´ SET Spotify_state = generate_random() WHERE login LIKE $1 RETURNING Spotify_state;`;

		const { rows } = await dbQuery.query(query, [req.user.login]);
		const SpotifyState = rows[0]['spotify_state'];

		const parameters = {
			response_type: 'code',
			client_id: process.env.SPOTIFY_CLIENT_ID,
			scope: SPOTIFY.SCOPES,
			redirect_uri: SPOTIFY.URL.REDIRECT,
			state: SpotifyState
		};

		const searchParams = new URLSearchParams(parameters);

		const apiEndPoint = new URL(SPOTIFY.URL.API.AUTHORIZE);

		apiEndPoint.search = searchParams;

		log('login', { redirect: apiEndPoint.toString() });

		res.redirect(apiEndPoint.toString());
	} catch (error) {
		return buildError(log, 'login', error, res);
	}
};
