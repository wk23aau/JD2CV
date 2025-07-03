import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const aiServiceApiKey = process.env.API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL_NAME || 'gemini-2.5-flash-preview-04-17';

if (!aiServiceApiKey) {
  console.error("CRITICAL: API_KEY for the AI service is not set in .env. CV generation will fail.");
}

const ai = new GoogleGenAI({ apiKey: aiServiceApiKey || "FALLBACK_KEY_DO_NOT_USE" }); 

class AIServiceError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

const formatUserProfileForPrompt = (userProfile) => {
  if (!userProfile) return "No user profile data provided. Create a compelling, representative CV based only on the job information.";

  let profileString = "Use the following user profile data to create the CV. Where data is missing, create compelling, illustrative examples relevant to the target job.\n\n";
  
  profileString += "--- Personal Details ---\n";
  profileString += `Name: ${userProfile.name || '[Your Name]'}\n`;
  if (userProfile.email) profileString += `Email: ${userProfile.email}\n`;
  if (userProfile.phoneNumber) profileString += `Phone: ${userProfile.phoneNumber}\n`;
  if (userProfile.linkedinUrl) profileString += `LinkedIn: ${userProfile.linkedinUrl}\n`;
  if (userProfile.address) {
      const { city, country } = userProfile.address;
      if(city || country) profileString += `Location: ${[city, country].filter(Boolean).join(', ')}\n`;
  }
  if (userProfile.headline) profileString += `\nProfessional Headline: ${userProfile.headline}\n`;

  if (userProfile.workExperiences && userProfile.workExperiences.length > 0) {
    profileString += "\n--- Work Experience ---\n";
    userProfile.workExperiences.forEach(exp => {
      profileString += `Job: ${exp.title} at ${exp.company}\n`;
      profileString += `Period: ${exp.startDate} to ${exp.isPresent ? 'Present' : exp.endDate}\n`;
      profileString += `Description: ${exp.description}\n\n`;
    });
  }

  if (userProfile.educations && userProfile.educations.length > 0) {
    profileString += "--- Education ---\n";
    userProfile.educations.forEach(edu => {
      profileString += `Degree: ${edu.degree}, ${edu.fieldOfStudy}\n`;
      profileString += `Institution: ${edu.institution}\n`;
      profileString += `Period: ${edu.startDate} to ${edu.isCurrent ? 'Present' : edu.endDate}\n\n`;
    });
  }

  if (userProfile.skillsSummary) {
      profileString += `--- Skills & Expertise ---\n${userProfile.skillsSummary}\n\n`;
  }

  if (userProfile.languages && userProfile.languages.length > 0) {
    profileString += "--- Languages ---\n";
    profileString += userProfile.languages.map(lang => `${lang.languageName} (${lang.proficiency})`).join(', ') + '\n\n';
  }

  if (userProfile.awards && userProfile.awards.length > 0) {
    profileString += "--- Awards & Recognitions ---\n";
    userProfile.awards.forEach(award => {
        profileString += `- ${award.awardName} from ${award.issuer} (${award.date})\n`;
    });
    profileString += "\n";
  }

  if (userProfile.publications && userProfile.publications.length > 0) {
    profileString += "--- Publications ---\n";
    userProfile.publications.forEach(pub => {
        profileString += `- "${pub.title}", ${pub.journalOrPlatform} (${pub.date})\n`;
    });
    profileString += "\n";
  }
  
  return profileString;
};


export const generateCVContent = async (jobInfo, userProfile = null) => {
  if (!jobInfo || typeof jobInfo !== 'string' || !jobInfo.trim()) {
    throw new AIServiceError('Job information is required.', 400);
  }
  if (!aiServiceApiKey || aiServiceApiKey === "FALLBACK_KEY_DO_NOT_USE") {
    console.error("AI Service API Key not configured on the server. Throwing error.");
    throw new AIServiceError("AI Service is not configured on the server. Please contact support.", 503);
  }

  const profileDataForPrompt = formatUserProfileForPrompt(userProfile);

  const prompt = `
    You are an expert CV (Resume) writer and career coach. Your task is to generate a complete, professional, and ATS-friendly CV based on the provided job information and user profile data. The output should be a ready-to-use CV, not just an outline. Fill in all sections with well-written, impactful content.

    **Job Information Provided:**
    ---
    ${jobInfo}
    ---

    **User Profile Data:**
    ---
    ${profileDataForPrompt}
    ---

    **Instructions:**
    1.  **Synthesize:** Combine the user's profile data with the requirements from the job information. If the user profile is sparse or missing, use the job info to create strong, relevant, and illustrative examples for the content.
    2.  **Format as a Real CV:** Structure the output like a final CV document. Use clear headings, bullet points, and professional formatting. Do not use instructional language like "Placeholder for..." or "You should write...". Instead, write the actual content. For example, instead of "A concise summary...", write a powerful, targeted summary itself.
    3.  **Contact Information:** At the top, list the user's contact details. If not provided, use clear placeholders like '[Your Name]', '[Your Phone]', etc.
    4.  **Professional Summary:** Write a 3-4 sentence summary that is tailored to the target job. It should highlight the most relevant skills and experiences.
    5.  **Skills Section:** Create a categorized list of skills. Extract skills from the user's profile and the job description. Common categories are 'Technical Skills', 'Soft Skills', 'Tools & Technologies', 'Languages'.
    6.  **Work Experience:** This is the most important section. For each job in the user's profile, rewrite the descriptions to be achievement-oriented, using the STAR method (Situation, Task, Action, Result). Use action verbs and quantify results wherever possible. If the user has no experience listed, create 1-2 sample job entries that would be relevant for the target role, clearly marking them as illustrative examples.
    7.  **Education:** List the user's education clearly.
    8.  **Projects/Other Sections:** Include other relevant sections from the user's profile (Projects, Publications, Awards, etc.) and format them professionally.
    9.  **Tone and Language:** Use professional, confident language. Ensure the entire document is free of grammatical errors and typos.
    10. **Final Output:** The final output should be the full text of the CV, ready to be copied and pasted into a document. Do not include these instructions or any meta-commentary in the final response. Start directly with the contact information.
  `;

  try {
    if (!ai.models || typeof ai.models.generateContent !== 'function') {
      console.error('Server AI SDK configuration error: ai.models.generateContent is not a function.');
      throw new AIServiceError('AI Service SDK is not properly configured on the server.', 500);
    }
    
    const response = await ai.models.generateContent({ model: MODEL_NAME, contents: prompt });
    const textOutput = response.text;
    
    if (!textOutput?.trim()) {
      console.warn('AI model returned an empty or invalid response for jobInfo:', jobInfo);
      throw new AIServiceError('Received an empty or invalid response from the AI model. Try refining your job information.', 502);
    }
    return textOutput;

  } catch (error) {
    console.error(`Error generating CV content with AI service for jobInfo "${jobInfo}":`, error.message);
    let errMsg = `AI generation failed: ${error.message || 'Unknown error from AI service'}`;
    let errStatusCode = 500;
    
    const lowerMsg = error.message?.toLowerCase();
    if (lowerMsg?.includes("api key not valid") || lowerMsg?.includes("unauthenticated") || lowerMsg?.includes("permission denied") || lowerMsg?.includes("quota")) {
      errMsg = "There is an issue with the AI service configuration or usage limits. Please contact support.";
      errStatusCode = 503; 
    } else if (lowerMsg?.includes("model not found") || lowerMsg?.includes("invalid model")) {
      errMsg = "The configured AI model is currently unavailable or invalid. Please try again later or contact support.";
      errStatusCode = 503;
    } else if (error.message?.includes("Deadline exceeded") || error.message?.includes("timeout")) {
        errMsg = "The AI service took too long to respond. Please try again later.";
        errStatusCode = 504;
    }
    
    throw new AIServiceError(errMsg, errStatusCode);
  }
};