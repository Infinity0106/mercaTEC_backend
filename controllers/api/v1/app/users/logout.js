module.exports = async function(req, res, next) {
  try {
    let user = req.locals.current_user;

    await user.delete_session_token(req.locals.token);

    res.status(204).send();
  } catch (e) {
    res.status(204).send();
  }
};
