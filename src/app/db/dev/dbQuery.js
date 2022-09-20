import pool from './pool';

export default pool;

export const getOffSet = (pageNumber, pageSize) => pageNumber * pageSize;
