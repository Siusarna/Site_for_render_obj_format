const authHelper = require('../helpers/authHelper');

const getInfoFromDbAndRenderPage = (res, payload) => {};

const loadPage = (req, res) => {
  const userToken = req.cookies.accessToken;
  try {
    const payload = authHelper.checkToken(userToken);
    getInfoFromDbAndRenderPage(res, payload);
  } catch (err) {
    const { status, message } = err;
    authHelper.processingError(req, res, status, message);
  }
};

module.exports = {
  loadPage
};
