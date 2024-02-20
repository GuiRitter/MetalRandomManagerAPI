import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	errorMessage,
	status
} from '../helper/status';

import {
	arePasswordsEqual,
	isNonEmptyString,
	generateUserToken
} from '../helper/validation';

import { getLog } from '../util/log';

const log = getLog('releaseDateController');

export const getPendingAlbum = async (req, res) => {
	const query = 'SELECT DISTINCT ar.id as artist_id, ar.name AS artist, al.id as album_id, al.name AS album, al.release_year, al.release_date, al.id FROM artist ar JOIN album al ON ar.id = al.artist JOIN song s ON al.id = s.album AND s.step <> 99 WHERE LENGTH(al.release_date) < 5 LIMIT 1;';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export const setReleaseDate = async (req, res) => {
	const { albumId, releaseYear, releaseDate } = req.body;
	log('setReleaseDate', { albumId, releaseYear, releaseDate });
	const query = 'update album set release_date = $1, release_year = $2 where id = $3 returning *;';
	try {
		const { rows } = await dbQuery.query(query, [releaseDate, releaseYear, albumId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getPage', error, res);
	}
};
