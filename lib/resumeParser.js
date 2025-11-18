/**
 * Resume Parser - Extract text from PDF and DOCX files
 * Supports client-side parsing for privacy and performance
 */

import mammoth from 'mammoth';

// Dynamically import pdfjs-dist only on client-side
let pdfjsLib = null;

if (typeof window !== 'undefined') {
  import('pdfjs-dist').then((pdfjs) => {
    pdfjsLib = pdfjs;
    // Use unpkg CDN for worker (more reliable than cloudflare)
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  });
}

/**
 * Extract text from PDF file
 * @param {File} file - PDF file object
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromPDF(file) {
  try {
    // Wait for pdfjs to load if needed
    if (!pdfjsLib) {
      const pdfjs = await import('pdfjs-dist');
      pdfjsLib = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

/**
 * Extract text from DOCX file
 * @param {File} file - DOCX file object
 * @returns {Promise<string>} Extracted text content
 */
export async function extractTextFromDOCX(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages && result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }
    
    return result.value.trim();
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error(`Failed to extract text from DOCX: ${error.message}`);
  }
}

/**
 * Extract text from file based on type
 * @param {File} file - File object (PDF, DOCX, or JSON)
 * @returns {Promise<{text?: string, json?: object, fileType: string}>}
 */
export async function extractFromFile(file) {
  const fileName = file.name.toLowerCase();
  const fileType = fileName.split('.').pop();
  
  try {
    // Handle JSON files directly
    if (fileType === 'json') {
      const text = await file.text();
      const json = JSON.parse(text);
      return { json, fileType: 'json' };
    }
    
    // Handle PDF files
    if (fileType === 'pdf') {
      const text = await extractTextFromPDF(file);
      return { text, fileType: 'pdf' };
    }
    
    // Handle DOCX files
    if (fileType === 'docx' || fileType === 'doc') {
      const text = await extractTextFromDOCX(file);
      return { text, fileType: 'docx' };
    }
    
    throw new Error(`Unsupported file type: ${fileType}. Please upload JSON, PDF, or DOCX files.`);
  } catch (error) {
    console.error('File extraction error:', error);
    throw error;
  }
}

/**
 * Validate resume data against schema
 * @param {object} data - Resume data object
 * @returns {object} Validated and sanitized resume data
 */
export function validateResumeSchema(data) {
  // Default structure matching app/types/resume.ts
  const defaultStructure = {
    name: '',
    position: '',
    contactInformation: '',
    email: '',
    address: '',
    profilePicture: '',
    socialMedia: [],
    summary: '',
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
    awards: []
  };
  
  // Merge with defaults to ensure all required fields exist
  const validated = { ...defaultStructure };
  
  // Validate and copy each field
  if (data.name && typeof data.name === 'string') validated.name = data.name;
  if (data.position && typeof data.position === 'string') validated.position = data.position;
  if (data.contactInformation && typeof data.contactInformation === 'string') validated.contactInformation = data.contactInformation;
  if (data.email && typeof data.email === 'string') validated.email = data.email;
  if (data.address && typeof data.address === 'string') validated.address = data.address;
  if (data.profilePicture && typeof data.profilePicture === 'string') validated.profilePicture = data.profilePicture;
  if (data.summary && typeof data.summary === 'string') validated.summary = data.summary;
  
  // Validate arrays
  if (Array.isArray(data.socialMedia)) {
    validated.socialMedia = data.socialMedia.map(sm => ({
      socialMedia: sm.socialMedia || '',
      displayText: sm.displayText || sm.socialMedia || '',
      link: sm.link || ''
    }));
  }
  
  if (Array.isArray(data.education)) {
    validated.education = data.education.map(edu => ({
      school: edu.school || '',
      degree: edu.degree || '',
      startYear: edu.startYear || '',
      endYear: edu.endYear || ''
    }));
  }
  
  if (Array.isArray(data.workExperience)) {
    validated.workExperience = data.workExperience.map(exp => ({
      company: exp.company || '',
      position: exp.position || '',
      description: exp.description || '',
      keyAchievements: exp.keyAchievements || '',
      startYear: exp.startYear || '',
      endYear: exp.endYear || ''
    }));
  }
  
  if (Array.isArray(data.projects)) {
    validated.projects = data.projects.map(proj => ({
      name: proj.name || '',
      description: proj.description || '',
      keyAchievements: proj.keyAchievements || '',
      startYear: proj.startYear || '',
      endYear: proj.endYear || '',
      link: proj.link || ''
    }));
  }
  
  if (Array.isArray(data.skills)) {
    validated.skills = data.skills.map(skill => ({
      title: skill.title || '',
      skills: Array.isArray(skill.skills) ? skill.skills : []
    }));
  }
  
  if (Array.isArray(data.languages)) {
    validated.languages = data.languages;
  }
  
  if (Array.isArray(data.certifications)) {
    validated.certifications = data.certifications.map(cert => 
      typeof cert === 'string' 
        ? { name: cert, issuer: '', link: '' }
        : {
            name: cert.name || '',
            issuer: cert.issuer || '',
            link: cert.link || ''
          }
    );
  }
  
  if (Array.isArray(data.awards)) {
    validated.awards = data.awards.map(award => ({
      name: award.name || '',
      issuer: award.issuer || '',
      link: award.link || '',
      year: award.year || award.date || ''
    }));
  }
  
  return validated;
}
