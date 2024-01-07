import dbQuery from '../db/dev/dbQuery';

import {
	arePasswordsEqual,
	isNonEmptyString,
	generateUserToken
} from '../helper/validation';

import {
	errorMessage,
	status,
	successMessage
} from '../helper/status';

export const getPendingAlbum = async (req, res) => {
	// const query = 'SELECT ar.name, al.name, al.release_year, al.release_date, al.id FROM artist ar JOIN album al ON ar.id = al.artist WHERE LENGTH(al.release_date) < 5 LIMIT 1';
	const query = 'SELECT ar.name, al.name, al.release_year, al.release_date, al.id FROM artist ar JOIN album al ON ar.id = al.artist WHERE LENGTH(al.release_date) < 2 LIMIT 1';
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
	const query = 'update album set release_date = $1, release_year = $2 where id = $3 returning *;';
	try {
		const { rows } = await dbQuery.query(query, [releaseDate, releaseYear, albumId]);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};
