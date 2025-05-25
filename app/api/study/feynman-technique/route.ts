import { NextRequest, NextResponse } from 'next/server';
import { getStudyFrameworkPrompt } from '@/lib/study-prompts';
import { StudyFramework } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model = 'neuman-google' } = body;

    // Get the Feynman Technique system prompt
    const systemPrompt = getStudyFrameworkPrompt(StudyFramework.FeynmanTechnique);

    // Modify the messages to include the study framework system prompt
    const modifiedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Forward to the main chat API with the modified system prompt
    const chatResponse = await fetch(`${request.nextUrl.origin}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        messages: modifiedMessages,
        model
      })
    });

    if (!chatResponse.ok) {
      throw new Error(`Chat API responded with status: ${chatResponse.status}`);
    }

    // Return the streaming response
    return new NextResponse(chatResponse.body, {
      status: chatResponse.status,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      }
    });

  } catch (error) {
    console.error('Feynman Technique API error:', error);
    return NextResponse.json(
      { error: 'Failed to process Feynman Technique request' },
      { status: 500 }
    );
  }
} 