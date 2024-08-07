import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/text';

const rapApi = axios.create({
  baseURL: API_URL,
});

const rap = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await rapApi.post('', {
      role: 'user',
      message,
    });
    return res.json(response.data); 
  } catch (error) {
    console.error('Error in API call:', error);
    return res.status(500).json({ error: 'Error in API call' });
  }
};

export default rap; 