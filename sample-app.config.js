export default ({ config }) => {
  const extra = {
    FACEBOOK_APP_ID: 'your facebook app id',
    FACEBOOK_APP_SECRET: 'your facebook app secret',
    INDEED_PUBLISHER_ID: '4201738803816157',
  };
  return {
    ...config,
    extra,
  };
};
