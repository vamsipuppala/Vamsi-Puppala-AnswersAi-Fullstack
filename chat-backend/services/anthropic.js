const axios = require('axios');
require('dotenv').config();
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY); 
const getAnthropicResponse = async (message) => {
  console.log('ANTHROPIC_API_KEY:I', process.env.ANTHROPIC_API_KEY); 
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 300,
        messages: [
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      }
    );
    console.log('Anthropic response data:', response.data); // Debugging line
    return response.data.content[0].text.trim();
  } catch (error) {
    if (error.response) {
      console.log('Error response data:', error.response.data);
    } else {
      console.log('Error message:', error.message);
    }
    throw new Error('Error getting Anthropic response');
  }
};

console.log('Exporting getAnthropicResponse function');
module.exports = { getAnthropicResponse };
