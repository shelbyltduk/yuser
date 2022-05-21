const {Service} = require('feathers-nedb');

const crypto = require('crypto');

const gravatarUrl = 'https://s.gravatar.com/avatar';

const query = 's=60';

const getGravatar = email => {
  // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  // Return the full avatar URL
  return `${gravatarUrl}/${hash}?${query}`;
};

exports.Users = class Users extends Service {
  create(data, params) {
    const {email, password, githubId} = data;

    const avatar = data.avatar || getGravatar(email);

    const userData = {
      email,
      password,
      githubId,
      avatar
    };

    return super.create(userData, params);
  }
};
