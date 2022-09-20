import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	status
} from '../helper/status';

import { getOffSet } from '../db/dev/dbQuery';

import { getLog } from '../util/log';

const log = getLog('artistController');

export const getPage = async (req, res) => {
	const { number: pageNumber, size: pageSize } = req.query;
	const offSet = getOffSet(pageNumber, pageSize);
	log('getPage', { pageNumber, pageSize, offSet });
	const query = 'SELECT null AS id, null AS name, COUNT(*) AS count FROM artist UNION (SELECT id, name, NULL AS count FROM artist ORDER BY name LIMIT $1 OFFSET $2) ORDER BY count, name;';
	try {
		const { rows } = await dbQuery.query(query, [pageSize, offSet]);
		const count = rows.filter(row => row.count).pop().count;
		rows = rows.filter(row => !row.count).map(row => {
			delete row.count;
			return row;
		});
		log('getPage', { count, 'rows.length': rows.length });
		return res.status(status.success).send({ count, rows });
	} catch (error) {
		return buildError(log, 'deleteMethod', error, res);
	}
};
