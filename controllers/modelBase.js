const authHelper = require('../helpers/authHelper');

const loadPage = (req, res) => {
  const userToken = req.cookies.accessToken;
  try {
    const payload = authHelper.checkToken(userToken);
    getInfoFromDbAndRenderPage(res, payload);
  } catch (err) {
    const { status, message } = err;
    processingError(req, res, status, message);
  }
};
