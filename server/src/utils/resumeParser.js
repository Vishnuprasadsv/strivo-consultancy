import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

export const checkKeywordMatch = async (file) => {
  try {
    let resumeText = "";
    const fileName = file.originalname.toLowerCase();
    
    // Read text from PDF or DOCX file
    if (fileName.endsWith(".pdf")) {
      const data = await pdfParse(file.buffer);
      resumeText = data.text || "";
    } else if (fileName.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = result.value || "";
    } else {
      // Fallback for TXT files
      resumeText = file.buffer.toString("utf8");
    }
    
    const resumeLower = resumeText.toLowerCase();
    
    // Standard keywords list for developers, designers, and business consultants
    const keywords = [
      "javascript", "react", "html", "css", "node", "express", "mongodb", 
      "python", "java", "typescript", "angular", "vue", "nextjs", "git", 
      "sql", "aws", "docker", "kubernetes", "api", "ui", "ux", "figma", 
      "design", "strategy", "management", "business", "consulting", 
      "planning", "analyst", "finance", "marketing", "leadership", 
      "project", "hr", "recruitment", "hiring"
    ];
    
    // Check if at least 1 keyword is present in the resume
    let matchCount = 0;
    for (let word of keywords) {
      if (resumeLower.includes(word)) {
        matchCount++;
      }
    }
    
    console.log("Resume matched keywords count:", matchCount);
    
    // Match is successful if we find at least 1 matching keyword
    return matchCount >= 1;
  } catch (error) {
    console.error("Error matching resume keywords:", error);
    // If parsing fails, allow candidate to pass so we don't block them due to file encoding issues
    return true;
  }
};
