import dbQuery from '../db/dev/dbQuery';

import {
	isNonEmptyString, // TODO guritter
} from '../helper/validation';

import {
	errorMessage,
	status,
	successMessage
} from '../helper/status';

const getList = async (req, res) => {
	const query = 'SELECT s.id, s.name AS song, ar.name AS artist, al.name AS album, al.release_date, s.registered_at, s.step FROM song s JOIN album al ON s.album = al.id JOIN artist ar ON al.artist = ar.id WHERE s.step = -2 ORDER BY s.step, (CASE WHEN s.registered_at IS NULL THEN 0 ELSE 1 END), s.registered_at, al.release_date, al.name, ar.name, s.name';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};

export {
	getList
};

