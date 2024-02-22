import dbQuery from '../db/dev/dbQuery';

import {
	buildError,
	status
} from '../helper/status';

import { getOffSet } from '../db/dev/dbQuery';

import { getRowsWithCount } from '../util/crud';

import { getLog } from '../util/log';

const log = getLog('artistController');

export const getPage = async (req, res) => {
	const { number: pageNumber, size: pageSize } = req.query;
	const offSet = getOffSet(pageNumber, pageSize);
	log('getPage', { pageNumber, pageSize, offSet });
	const query = 'SELECT null AS id, null AS name, COUNT(*) AS count FROM artist UNION (SELECT id, name, NULL AS count FROM artist ORDER BY name LIMIT $1 OFFSET $2) ORDER BY count, name;';
	try {
		let { rows } = await dbQuery.query(query, [pageSize, offSet]);
		const rowsWithCount = getRowsWithCount(rows);
		log('getPage', { count: rowsWithCount.count, 'rows.length': rowsWithCount.rows.length });
		return res.status(status.success).send(rowsWithCount);
	} catch (error) {
		return buildError(log, 'getPage', error, res);
	}
};
