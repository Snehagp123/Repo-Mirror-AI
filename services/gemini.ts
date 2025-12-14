import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, RepoContext } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRepoWithGemini = async (context: RepoContext): Promise<AnalysisResult> => {
  const { metadata, files, readmeContent, packageJsonContent, languages } = context;

  // Prepare concise context to fit token limits
  const truncatedFiles = files.length > 300 ? files.slice(0, 300).join('\n') + `\n...(${files.length - 300} more files)` : files.join('\n');
  const truncatedReadme = readmeContent ? (readmeContent.length > 8000 ? readmeContent.slice(0, 8000) + '...' : readmeContent) : "No README found.";
  const truncatedPkgJson = packageJsonContent ? (packageJsonContent.length > 2000 ? packageJsonContent.slice(0, 2000) : packageJsonContent) : "No package.json found.";

  const prompt = `
    You are a Senior Principal Software Engineer and Technical Interviewer. 
    Analyze the following GitHub repository data to provide a "Repository Mirror" report for a student/junior developer.
    
    **Goal:** Evaluate the project's quality, completeness, and professionalism. Be honest but constructive.
    
    **Repository Data:**
    - Name: ${metadata.full_name}
    - Description: ${metadata.description}
    - Primary Language: ${metadata.language}
    - Stars: ${metadata.stargazers_count}
    - Tech Stack (Languages): ${JSON.stringify(languages)}
    
    **File Structure:**
    ${truncatedFiles}
    
    **README Content:**
    ${truncatedReadme}
    
    **Package/Dependency Config:**
    ${truncatedPkgJson}

    **Instructions:**
    1. Analyze the Code Quality, Structure, Documentation, Testing, and Real-world Relevance.
    2. Assign a Score (0-100) based on how "job-ready" or professional this repo is.
       - < 40: Needs major work.
       - 40-70: Decent start, needs polish.
       - 70-90: Good, professional.
       - 90+: Exceptional.
    3. Generate a Summary that is specific to this codebase.
    4. Create a Personalized Roadmap with actionable steps. Suggest specific tools (e.g., "Use Jest for testing", "Add GitHub Actions for CI").
    5. Rate 5 specific dimensions: Code Quality, Documentation, Maintainability, Testing, Structure (0-100).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall score 0-100" },
          summary: { type: Type.STRING, description: "A concise executive summary of the repo quality." },
          strengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 key strengths."
          },
          weaknesses: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 key weaknesses."
          },
          ratings: {
            type: Type.OBJECT,
            properties: {
              codeQuality: { type: Type.NUMBER },
              documentation: { type: Type.NUMBER },
              maintainability: { type: Type.NUMBER },
              testing: { type: Type.NUMBER },
              structure: { type: Type.NUMBER },
            },
            required: ["codeQuality", "documentation", "maintainability", "testing", "structure"]
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                category: { type: Type.STRING, enum: ["Structure", "Documentation", "Testing", "Best Practices", "CI/CD"] }
              },
              required: ["title", "description", "priority", "category"]
            }
          }
        },
        required: ["score", "summary", "strengths", "weaknesses", "ratings", "roadmap"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as AnalysisResult;
};