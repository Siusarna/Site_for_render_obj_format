module.exports = {
  appPort: 3000,
  mongoUri: 'mongodb://localhost:27017/siteForRenderObj',
  jwt: {
    secret: 'Siusarna',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '3m'
      },
      refresh: {
        type: 'refresh',
        expiresIn: '5m'
      }
    }
  }
};
