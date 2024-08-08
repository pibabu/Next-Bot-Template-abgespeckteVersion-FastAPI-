import axios from 'axios';
import { NextResponse } from 'next/server';

const API_URL = 'http://127.0.0.1:8000/api/text';

const rapApi = axios.create({
  baseURL: API_URL,
});

// Export the POST method
export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { message } = await req.json(); // Parse the JSON body

  try {
    const response = await rapApi.post('', {
      role: 'user',
      message,
    });
    return NextResponse.json(response.data); 
  } catch (error) {
    console.error('Error in API call:', error);
    return NextResponse.json({ error: 'Error in API call' }, { status: 500 });
  }
}