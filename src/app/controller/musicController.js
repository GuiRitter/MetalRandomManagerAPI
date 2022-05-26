import dbQuery from '../db/dev/dbQuery';

import {
	errorMessage,
	status,
	successMessage
} from '../helper/status';

export const getDone = async (req, res) => {
	const query = 'SELECT s.name AS song, ar.name AS artist, al.name AS album, al.release_date, s.registered_at FROM song s JOIN album al ON s.album = al.id JOIN artist ar ON al.artist = ar.id WHERE s.step = 4 ORDER BY ar.name, al.release_date, al.name, s.name';
	try {
		const { rows } = await dbQuery.query(query);
		return res.status(status.success).send(rows);
	} catch (error) {
		errorMessage.error = 'Unknown error.';
		return res.status(status.error).send(errorMessage);
	}
};
