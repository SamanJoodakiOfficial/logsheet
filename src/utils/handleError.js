const flashAndRedirect = require('./flashAndRedirect');

const handleError = (error, req, res, redirectUrl) => {
    console.error(error.message);
    flashAndRedirect(req, res, 'error', req.__('server_error'), redirectUrl);
}

module.exports = handleError;