import 'dotenv/config'; // always first import
import express from 'express';
import '@babel/polyfill';
import cors from 'cors';

import artistRoute from './app/route/artistRoute';
import musicRoute from './app/route/musicRoute';
import releaseDateRoute from './app/route/releaseDateRoute';
import toDoRoute from './app/route/toDoRoute';
import trackNumberRoute from './app/route/trackNumberRoute';
import userRoute from './app/route/userRoute';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/metal_random_manager/api/artist', artistRoute);
app.use('/metal_random_manager/api/music', musicRoute);
app.use('/metal_random_manager/api/release_date', releaseDateRoute);
app.use('/metal_random_manager/api/to_do', toDoRoute);
app.use('/metal_random_manager/api/track_number', trackNumberRoute);
app.use('/metal_random_manager/api/user', userRoute);

app.listen(process.env.PORT, '127.0.0.1').on('listening', () => {
	console.log(`${(new Date()).toISOString()} are live on ${process.env.PORT}`);
});

export default app;
