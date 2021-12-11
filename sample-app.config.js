export default ({ config }) => {
  const extra = {
    FACEBOOK_APP_ID: 'your facebook app id',
    FACEBOOK_APP_SECRET: 'your facebook app secret',
  };
  return {
    ...config,
    extra,
  };
};
