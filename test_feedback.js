const axios = require('axios');
async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/auth/signin', {
      email: 'milanibackups@gmail.com',
      password: 'your_password' // need to guess or create a user, I'll just use a random token or create a user.
    });
  } catch(e) {}
}
test();
