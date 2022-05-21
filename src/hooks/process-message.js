module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const {data} = context;

    if (!data.text) {
      throw new Error('Empty message');
    }

    const {user} = context.params;
    const text = data.text.substring(0, 400);

    context.data = {
      text,
      userId: user.id,
      createdAt: new Date().getTime()
    };

    return context;
  };
};
