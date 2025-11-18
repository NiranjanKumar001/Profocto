import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Gemini API keys array for rotation
const GEMINI_API_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4,
  process.env.GEMINI_KEY_5,
].filter(Boolean); // Remove undefined keys

// Track current key index (in production, use Redis or database)
let currentKeyIndex = 0;

/**
 * Parse resume text using Gemini AI with automatic key rotation
 */
async function parseResumeWithGemini(resumeText: string, maxRetries = 5): Promise<any> {
  if (GEMINI_API_KEYS.length === 0) {
    throw new Error('No Gemini API keys configured. Please add GEMINI_KEY_1 to GEMINI_KEY_5 in .env.local');
  }
  const prompt = `You are a resume parser. Extract ALL information from this resume and return it as a valid JSON object.

IMPORTANT: Return ONLY the JSON object, no markdown formatting, no explanation, no code blocks.

Required JSON structure:
{
  "name": "Full name",
  "position": "Job title or desired position",
  "email": "email@example.com",
  "contactInformation": "Phone number",
  "address": "City, State or full address",
  "summary": "Professional summary or objective",
  "workExperience": [
    {
      "company": "Company name",
      "position": "Job title",
      "description": "Job description",
      "keyAchievements": "Key achievements (separate multiple with newlines)",
      "startYear": "YYYY-MM-DD or YYYY-MM",
      "endYear": "YYYY-MM-DD or YYYY-MM or Present"
    }
  ],
  "education": [
    {
      "school": "University/School name",
      "degree": "Degree and major",
      "startYear": "YYYY-MM-DD or YYYY-MM",
      "endYear": "YYYY-MM-DD or YYYY-MM"
    }
  ],
  "skills": [
    {
      "title": "Category name (e.g., Programming Languages, Tools)",
      "skills": ["skill1", "skill2", "skill3"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Project description",
      "keyAchievements": "Key achievements",
      "startYear": "YYYY-MM-DD or YYYY-MM",
      "endYear": "YYYY-MM-DD or YYYY-MM",
      "link": "Project URL if available"
    }
  ],
  "languages": ["Language1", "Language2"],
  "certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing organization",
      "link": "Certificate URL if available"
    }
  ],
  "socialMedia": [
    {
      "socialMedia": "Platform name (LinkedIn, GitHub, Website, etc.)",
      "displayText": "Display text",
      "link": "Profile URL"
    }
  ],
  "awards": [
    {
      "name": "Award name",
      "issuer": "Issuing organization",
      "year": "YYYY-MM-DD or YYYY",
      "link": "Award URL if available"
    }
  ]
}

Rules:
1. Extract ALL sections found in the resume
2. For dates: use YYYY-MM-DD format when possible, YYYY-MM if only month/year, or "Present" for current positions
3. If a field is not found, use empty string "" or empty array []
4. For skills, group them by category if the resume has categories
5. Extract URLs from LinkedIn, GitHub, websites, etc. and add to socialMedia
6. Return ONLY valid JSON, no additional text

Resume text:
${resumeText}`;

  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Get current API key
      const apiKey = GEMINI_API_KEYS[currentKeyIndex];
      
      if (!apiKey) {
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
        continue;
      }

      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Clean up response - remove markdown code blocks if present
      text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

      // Parse JSON
      const parsedData = JSON.parse(text);

      // Validate basic structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid JSON structure returned from Gemini');
      }

      return parsedData;

    } catch (error: any) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed with key ${currentKeyIndex}:`, error?.message || error);

      // Check if it's a quota/authentication error
      if (
        error?.message?.includes('quota') ||
        error?.message?.includes('RESOURCE_EXHAUSTED') ||
        error?.message?.includes('429') ||
        error?.message?.includes('API key')
      ) {
        // Rotate to next key
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
        console.log(`Rotating to key index ${currentKeyIndex}`);
        continue;
      }

      // If it's a JSON parsing error, try to extract JSON from the text
      if (error instanceof SyntaxError && attempt < maxRetries - 1) {
        continue;
      }

      // For other errors, throw immediately
      if (attempt === maxRetries - 1) {
        throw error;
      }
    }
  }

  throw new Error(`Failed to parse resume after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`);
}

/**
 * POST /api/parse-resume
 * Parse resume text using Gemini AI
 */
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: text field is required' },
        { status: 400 }
      );
    }

    if (text.length < 50) {
      return NextResponse.json(
        { error: 'Resume text is too short. Please provide a complete resume.' },
        { status: 400 }
      );
    }

    if (text.length > 50000) {
      return NextResponse.json(
        { error: 'Resume text is too long. Please provide a resume under 50,000 characters.' },
        { status: 400 }
      );
    }

    // Parse with Gemini
    const parsedData = await parseResumeWithGemini(text);

    // Return parsed data
    return NextResponse.json({
      success: true,
      data: parsedData,
    });

  } catch (error: any) {
    console.error('Resume parsing error:', error);

    // Return appropriate error response
    if (error?.message?.includes('No Gemini API keys')) {
      return NextResponse.json(
        { error: 'Service configuration error. Please contact support.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: error?.message || 'Failed to parse resume. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    );
  }
}
