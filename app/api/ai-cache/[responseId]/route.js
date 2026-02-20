import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import Response from "@/models/Response";

/**
 * GET /api/ai-cache/[responseId]
 * Retrieve cached AI-generated content for a response
 */
export async function GET(req, { params }) {
  try {
    const { responseId } = await params;

    if (!responseId) {
      return NextResponse.json(
        { error: "Response ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const response = await Response.findById(responseId).select('aiGeneratedContent');

    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    // Check if cache exists
    const hasCache = response.aiGeneratedContent && (
      response.aiGeneratedContent.avatar?.imageUrl ||
      (response.aiGeneratedContent.customContent && response.aiGeneratedContent.customContent.length > 0)
    );

    return NextResponse.json({
      cached: hasCache,
      aiGeneratedContent: response.aiGeneratedContent || {}
    }, { status: 200 });

  } catch (error) {
    console.error("AI cache retrieval error:", error);
    return NextResponse.json(
      { 
        error: "Failed to retrieve cache",
        details: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai-cache/[responseId]
 * Save AI-generated content to cache
 */
export async function POST(req, { params }) {
  try {
    const { responseId } = await params;
    const body = await req.json();

    console.log('🔵 Cache POST - Response ID:', responseId);
    console.log('🔵 Cache POST - Body:', JSON.stringify(body, null, 2));

    if (!responseId) {
      return NextResponse.json(
        { error: "Response ID is required" },
        { status: 400 }
      );
    }

    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: "Type and data are required" },
        { status: 400 }
      );
    }

    await connectMongo();

    const response = await Response.findById(responseId);
    console.log('🔵 Found response:', response ? 'YES' : 'NO');

    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 }
      );
    }

    // Initialize aiGeneratedContent if it doesn't exist
    if (!response.aiGeneratedContent) {
      response.aiGeneratedContent = {
        customContent: []
      };
    }

    // Update cache based on type
    if (body.type === 'avatar') {
      response.aiGeneratedContent.avatar = {
        imageUrl: body.data.imageUrl,
        avatarName: body.data.avatarName,
        prompt: body.data.prompt,
        generatedAt: new Date()
      };
    } else if (body.type === 'custom') {
      // Initialize customContent array if it doesn't exist
      if (!response.aiGeneratedContent.customContent) {
        response.aiGeneratedContent.customContent = [];
      }
      
      // Check if this component already has cached content
      const existingIndex = response.aiGeneratedContent.customContent.findIndex(
        c => c.componentId === body.componentId
      );

      const customContentItem = {
        componentId: body.componentId,
        title: body.title,
        content: body.data.content || body.data,
        generatedAt: new Date()
      };

      if (existingIndex >= 0) {
        // Update existing cache
        response.aiGeneratedContent.customContent[existingIndex] = customContentItem;
      } else {
        // Add new cache
        response.aiGeneratedContent.customContent.push(customContentItem);
      }
    }

    // Mark the field as modified (important for nested objects in Mongoose)
    response.markModified('aiGeneratedContent');
    await response.save();

    console.log('✅ Cache saved successfully for response:', responseId);
    console.log('✅ Saved data:', JSON.stringify(response.aiGeneratedContent, null, 2));

    return NextResponse.json({
      message: "Cache saved successfully",
      cached: true
    }, { status: 200 });

  } catch (error) {
    console.error("❌ AI cache save error:", error);
    console.error("❌ Error stack:", error.stack);
    return NextResponse.json(
      { 
        error: "Failed to save cache",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
