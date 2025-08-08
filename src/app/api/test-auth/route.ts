import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
    
    // Test the backend connection
    const response = await fetch(`${backendUrl}/auth/test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ 
        success: true, 
        message: 'Backend connection successful',
        backendUrl 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Backend connection failed',
        status: response.status,
        backendUrl 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Backend connection test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Backend connection error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
