module.exports = {
  appPort: (process.env.PORT || 3000),
  mongoUri: (process.env.MONGOLAB_URI),
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
  },
  email: 'SiusarnaSite@gmail.com',
  pass: "asdfghjkl;'12"
};
