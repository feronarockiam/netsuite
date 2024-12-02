const express = require('express');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// NetSuite API credentials
const credentials = {
  consumerKey: '86496bda4bb8e767d4e1db2767a5e30ef40df13748077695fc9062cd77eeaed3',
  consumerSecret: '5e9397b8f3349490ac992348536a525a13f4a8cfca2f5ce383ea264b754b4976',
  token: '37e099f0164fe90a5cd063e122ab621b8bce1160aacfeaddd4850caa3ae21962',
  tokenSecret: '76b9474e5104a5ce14c61274a76dec43f396547121d9932396ee9c8b08e975e6',
  realm: '861427_SB2',
};

// Initialize OAuth 1.0
const oauth = OAuth({
  consumer: {
    key: credentials.consumerKey,
    secret: credentials.consumerSecret,
  },
  signature_method: 'HMAC-SHA256',
  hash_function(base_string, key) {
    return crypto.createHmac('sha256', key).update(base_string).digest('base64');
  },
});

// Route to handle '/'
app.get('/', (req, res) => {
  const requestData = {
    url: `https://861427-sb2.suitetalk.api.netsuite.com/services/rest/record/v1/customer/4849298`,
    method: 'GET',
  };

  // Generate OAuth header
  const oauthHeader = oauth.toHeader(
    oauth.authorize(requestData, {
      key: credentials.token,
      secret: credentials.tokenSecret,
    })
  );

  // Add the Realm to the OAuth header
  oauthHeader.Authorization += `, realm="${credentials.realm}"`;

  // Return the OAuth Authorization header
  res.json({ authorizationHeader: oauthHeader.Authorization });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
