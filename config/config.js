module.exports = {
  appPort: 3000,
  mongoUri: "mongodb://localhost:27017/siteForRenderObj",
  jwt: {
    secret: "Siusarna",
    tokens: {
      access: {
        type: "access",
        expiresIn: "2m"
      },
      refresh: {
        type: "refresh",
        expiresIn: "3m"
      }
    }
  }
};
