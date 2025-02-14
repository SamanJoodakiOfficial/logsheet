function flashAndRedirect(req, res, messageType, message, redirectUrl) {
    req.flash(messageType, message);
    res.redirect(redirectUrl);
}

module.exports = flashAndRedirect;