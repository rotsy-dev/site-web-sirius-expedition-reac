// netlify/functions/subscribe.js
const https = require('https');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { email } = JSON.parse(event.body);

    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email invalide' }),
      };
    }

    // Get Mailchimp credentials from environment variables
    const API_KEY = process.env.MAILCHIMP_API_KEY;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;

    if (!API_KEY || !AUDIENCE_ID || !SERVER_PREFIX) {
      console.error('Missing Mailchimp configuration');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration serveur manquante' }),
      };
    }

    // Prepare Mailchimp data
    const data = JSON.stringify({
      email_address: email,
      status: 'pending', // Double opt-in (l'utilisateur doit confirmer par email)
      tags: ['Website Signup'], // Tag optionnel pour identifier la source
    });

    // Mailchimp API options
    const options = {
      hostname: `${SERVER_PREFIX}.api.mailchimp.com`,
      path: `/3.0/lists/${AUDIENCE_ID}/members`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Bearer ${API_KEY}`,
      },
    };

    // Make request to Mailchimp
    const mailchimpResponse = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            resolve({ statusCode: res.statusCode, body: response });
          } catch (e) {
            reject(new Error('Invalid response from Mailchimp'));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(data);
      req.end();
    });

    // Handle Mailchimp response
    if (mailchimpResponse.statusCode === 200) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Inscription réussie ! Vérifiez votre boîte mail pour confirmer.',
        }),
      };
    } else if (mailchimpResponse.statusCode === 400) {
      // Check if already subscribed
      if (mailchimpResponse.body.title === 'Member Exists') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'Cet email est déjà inscrit à notre newsletter.',
          }),
        };
      }
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Erreur lors de l\'inscription. Veuillez réessayer.',
        }),
      };
    } else {
      console.error('Mailchimp error:', mailchimpResponse.body);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: 'Erreur serveur. Veuillez réessayer plus tard.',
        }),
      };
    }
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Erreur lors de l\'inscription. Veuillez réessayer.',
      }),
    };
  }
};