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

import { getRowsWithCount } from '../util/crud';

import { getLog } from '../util/log';

const log = getLog('releaseDateController');

export const getPendingTrackNumber = async (req, res) => {
	// const query = 'SELECT ar.id, ar.name, al.id, al.name, al.release_date, s.id, s.name, s.track_number, 0 AS remaining_count FROM song s JOIN album al ON s.album = al.id JOIN artist ar ON al.artist = ar.id WHERE s.album IN (SELECT album FROM song WHERE track_number = 0 LIMIT 1) UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, COUNT(*) FROM song WHERE track_number = 0;';
	const query = `SELECT ar.id, ar.name, al.id, al.name, al.release_date, s.id, s.name, s.track_number, 0 AS remaining_count FROM song s JOIN album al ON s.album = al.id JOIN artist ar ON al.artist = ar.id WHERE s.album IN ('34d35d83-2b97-4f10-afb0-8431f5aa3b57') UNION SELECT NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, COUNT(*) FROM song WHERE track_number = 0;`;
	try {
		const { rows } = await dbQuery.query(query);
		const rowsWithCount = getRowsWithCount(rows);
		log('getPage', { count: rowsWithCount.count, 'rows.length': rowsWithCount.rows.length });
		return res.status(status.success).send(rowsWithCount);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export const setTrackNumber = async (req, res) => {
	const { songList } = req.body;
	log('setReleaseDate', { songList });
	const innerQuery = songList.map((song, index) => {
		const offSet = index * 3;
		return (index == 0)
			? `SELECT uuid($${offSet + 1}) AS song_id, $${offSet + 2} AS song_track_side, $${offSet + 3} AS song_track_number`
			: `SELECT uuid($${offSet + 1}), $${offSet + 2}, $${offSet + 3}`;
	}).join(' UNION ');
	const innerQueryParameters = songList.flatMap(song => [song.id, song.trackSide, song.trackNumber]);
	const query = `UPDATE song SET track_side = song_track_side, track_number = song_track_number FROM (${innerQuery}) union_data WHERE id = song_id RETURNING *;`;
	try {
		const { rows } = await dbQuery.query(query, innerQueryParameters);
		return res.status(status.success).send(rows);
	} catch (error) {
		return buildError(log, 'getPage', error, res);
	}
};
