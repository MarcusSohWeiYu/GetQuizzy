import { NextResponse } from "next/server";
import connectMongo from "@/libs/db/mongoose";
import AdApplication from "@/models/AdApplication";
import { sendEmail } from "@/libs/api/resend";
import config from "@/config";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    const { name, email, company, website, description } = body;

    if (!name || !email || !company || !website || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate URL format
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    if (!urlRegex.test(website)) {
      return NextResponse.json(
        { error: "Invalid website URL" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Save application to database
    const application = await AdApplication.create({
      name,
      email,
      company,
      website,
      description,
      status: "pending",
    });

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL || config.resend.supportEmail;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #a855f7; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">
          New Ad Spot Early Access Application
        </h2>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>
          <p style="margin: 10px 0;"><strong>Website:</strong> <a href="${website}" style="color: #a855f7;">${website}</a></p>
        </div>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #374151; margin-bottom: 10px;">Business Description:</h3>
          <p style="background: #f9fafb; padding: 15px; border-radius: 8px; line-height: 1.6; color: #4b5563;">
            ${description}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
          <p>Application ID: ${application._id}</p>
          <p>Submitted: ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    const emailText = `
New Ad Spot Early Access Application

Name: ${name}
Email: ${email}
Company: ${company}
Website: ${website}

Business Description:
${description}

---
Application ID: ${application._id}
Submitted: ${new Date().toLocaleString()}
    `;

    try {
      await sendEmail({
        to: adminEmail,
        subject: "New Ad Spot Early Access Application - GetQuizzy",
        html: emailHtml,
        text: emailText,
        replyTo: email,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: "Application submitted successfully",
      applicationId: application._id,
    }, { status: 201 });

  } catch (error) {
    console.error("Ad application error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit application" },
      { status: 500 }
    );
  }
}
