const errorMessage = { status: 'error' };

const status = {
	success: 200,
	error: 500,
	notFound: 404,
	unauthorized: 401,
	conflict: 409,
	created: 201,
	bad: 400,
	noContent: 204,
};

const successMessage = { status: 'success' };

export {
	errorMessage,
	status,
	successMessage
};
