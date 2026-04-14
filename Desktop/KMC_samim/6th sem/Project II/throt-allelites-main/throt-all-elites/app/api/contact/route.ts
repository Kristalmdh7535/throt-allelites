// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:8080/api/contact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    console.log('📨 Received contact form:', { name, email });
    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    console.log('🚀 Sending to backend:', BACKEND_URL);

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      console.error('❌ Status:', response.status);
      
      return NextResponse.json(
        { message: `Backend error: ${errorText || response.statusText}` },
        { status: response.status }
      );
    }

    const responseText = await response.text();
    console.log('✅ Backend success:', responseText);
    
    return NextResponse.json(
      { message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('💥 Contact API error:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { message: 'Cannot connect to backend. Is Spring Boot running on port 8080?' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: 'Failed to send message: ' + (error as Error).message },
      { status: 500 }
    );
  }
}