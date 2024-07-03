import 'dotenv/config'; // always first import

import dbQuery from '../db/dev/dbQuery';

import { API_URL, SPOTIFY, WEB_URL } from '../common/settings';

import {
	buildError,
	// errorMessage,
	status
} from '../helper/status';

import axios from '../helper/axios';

import { getLog } from '../util/log';

const log = getLog('SpotifyController');

export const getToken = async (req, res) => {
	log('getToken', { query: req.query });
	try {
		const response = await axios.post(
			SPOTIFY.URL.API.TOKEN,
			{
				code: req.query.code,
				redirect_uri: `${API_URL}/Spotify/token`,
				grant_type: 'authorization_code',
			},
			{
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + (new Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'))
				}
			}
		);

		const query = `UPDATE ´user´ SET Spotify_token = $1 WHERE Spotify_state LIKE $2;`;

		await dbQuery.query(query, [response.data.access_token, req.query.state]);
		res.redirect(WEB_URL);
	} catch (error) {
		return buildError(log, 'getToken', error, res);
	}
};

export const getPlaylistList = async (req, res) => {
	log('getPlaylistList');
	try {
		const query = `SELECT Spotify_token FROM ´user´ WHERE login LIKE $1;`;
		const token = (await dbQuery.query(query, [req.user.login])).rows[0]['spotify_token'];
		const response = await axios.get(
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

		const SpotifyURL = new URL(SPOTIFY.URL.API.AUTHORIZE);

		SpotifyURL.search = new URLSearchParams({
			response_type: 'code',
			client_id: process.env.SPOTIFY_CLIENT_ID,
			scope: SPOTIFY.SCOPES,
			redirect_uri: `${API_URL}/Spotify/token`,
			state: SpotifyState
		});

		res.redirect(SpotifyURL.toString());
	} catch (error) {
		return buildError(log, 'login', error, res);
	}
};
