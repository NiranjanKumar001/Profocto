"use client";

import { FaCloudUploadAlt, FaCloudDownloadAlt } from "react-icons/fa";
import React, { useContext, useState } from "react";
import { ResumeContext } from "../../contexts/ResumeContext";

const LoadUnload = () => {
  const { resumeData, setResumeData } = useContext(ResumeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');

  // Parse different file types
  const parseFileContent = async (file) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    try {
      if (fileType === 'application/json' || fileName.endsWith('.json')) {
        return await parseJSON(file);
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await parsePDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        return await parseDOCX(file);
      } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
        return await parseDOC(file);
      } else if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.text')) {
        return await parseText(file);
      } else if (fileType === 'text/xml' || fileType === 'application/xml' || fileName.endsWith('.xml')) {
        return await parseXML(file);
      } else if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
        return await parseMarkdown(file);
      } else {
        throw new Error(`Unsupported file type: ${fileType || 'unknown'}`);
      }
    } catch (error) {
      console.error('Error parsing file:', error);
      throw error;
    }
  };

  // Parse JSON files
  const parseJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          resolve({ type: 'json', data: jsonData });
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  // Parse PDF files - improved version
  const parsePDF = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          // Try pdfjs-dist first
          const pdfjsLib = await import('pdfjs-dist');
          
          // Set worker source dynamically
          if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          }
          
          const typedArray = new Uint8Array(event.target.result);
          const loadingTask = pdfjsLib.getDocument({
            data: typedArray,
            verbosity: 0, // Reduce console output
            standardFontDataUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
            cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
            cMapPacked: true
          });
          
          const pdf = await loadingTask.promise;
          let fullText = '';
          
          // Process up to 10 pages for performance
          const maxPages = Math.min(pdf.numPages, 10);
          
          for (let i = 1; i <= maxPages; i++) {
            try {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              
              // Better text extraction with positioning
              const pageText = textContent.items
                .filter(item => item.str && item.str.trim().length > 0)
                .map(item => item.str.trim())
                .join(' ');
              
              if (pageText.trim()) {
                fullText += pageText + '\n\n';
              }
            } catch (pageError) {
              console.warn(`Error parsing page ${i}:`, pageError);
              // Continue with other pages
            }
          }
          
          if (fullText.trim().length > 10) {
            // Clean up the extracted text
            const cleanText = fullText
              .replace(/\s+/g, ' ') // Normalize whitespace
              .replace(/(.)\1{5,}/g, '$1') // Remove excessive character repetition
              .trim();
            
            resolve({ type: 'text', data: cleanText });
          } else {
            throw new Error('No readable text found in PDF');
          }
          
        } catch (error) {
          console.warn('PDF.js parsing failed, trying fallback method:', error);
          
          // Fallback: Basic text extraction
          try {
            const arrayBuffer = event.target.result;
            const text = new TextDecoder('latin1').decode(arrayBuffer);
            
            // Extract text between common PDF text markers
            const textPatterns = [
              /\(([^)]+)\)/g, // Text in parentheses
              /\[([^\]]+)\]/g, // Text in brackets
              /<([^>]+)>/g    // Text in angle brackets
            ];
            
            let extractedText = '';
            textPatterns.forEach(pattern => {
              let match;
              while ((match = pattern.exec(text)) !== null) {
                const content = match[1].trim();
                if (content.length > 1 && /[a-zA-Z]/.test(content)) {
                  extractedText += content + ' ';
                }
              }
            });
            
            // Also try to extract readable ASCII text
            const readableText = text
              .split('')
              .filter(char => {
                const code = char.charCodeAt(0);
                return (code >= 32 && code <= 126) || code === 10 || code === 13;
              })
              .join('')
              .replace(/\s+/g, ' ')
              .split(' ')
              .filter(word => word.length > 1 && /[a-zA-Z]/.test(word))
              .join(' ');
            
            const finalText = (extractedText + ' ' + readableText).trim();
            
            if (finalText.length > 20) {
              resolve({ type: 'text', data: finalText });
            } else {
              reject(new Error('Could not extract meaningful text from PDF. Please try converting to a text file or using OCR.'));
            }
          } catch (fallbackError) {
            reject(new Error(`PDF parsing failed: ${error.message}. Please try a different file format.`));
          }
        }
      };
      reader.onerror = () => reject(new Error('Error reading PDF file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse DOCX files using mammoth
  const parseDOCX = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          // Dynamic import for mammoth
          const mammoth = await import('mammoth');
          const arrayBuffer = event.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve({ type: 'text', data: result.value });
        } catch (error) {
          reject(new Error('Error parsing DOCX: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading DOCX file'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Parse DOC files (basic text extraction)
  const parseDOC = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Basic DOC parsing - extracts readable text
          const text = event.target.result;
          const cleanText = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ').replace(/\s+/g, ' ').trim();
          resolve({ type: 'text', data: cleanText });
        } catch (error) {
          reject(new Error('Error parsing DOC: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading DOC file'));
      reader.readAsText(file, 'utf-8');
    });
  };

  // Parse text files
  const parseText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({ type: 'text', data: event.target.result });
      };
      reader.onerror = () => reject(new Error('Error reading text file'));
      reader.readAsText(file);
    });
  };

  // Parse XML files
  const parseXML = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(event.target.result, 'text/xml');
          const textContent = xmlDoc.textContent || xmlDoc.innerText || '';
          resolve({ type: 'text', data: textContent.trim() });
        } catch (error) {
          reject(new Error('Error parsing XML: ' + error.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading XML file'));
      reader.readAsText(file);
    });
  };

  // Parse Markdown files
  const parseMarkdown = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve({ type: 'markdown', data: event.target.result });
      };
      reader.onerror = () => reject(new Error('Error reading Markdown file'));
      reader.readAsText(file);
    });
  };

  // Helper function to extract dates
  const extractDate = (dateString, type = 'start') => {
    const dateMatch = dateString.match(/(\d{4})/g);
    if (dateMatch && dateMatch.length > 0) {
      const year = type === 'start' ? dateMatch[0] : dateMatch[dateMatch.length - 1];
      const month = type === 'start' ? '01' : '12';
      return `${year}-${month}-01`;
    }
    return type === 'start' ? '2020-01-01' : '2024-01-01';
  };

  // Extract resume data from text content and map to form structure
  const extractResumeData = (textContent) => {
    const lines = textContent.split('\n').map(line => line.trim()).filter(line => line);
    
    // Create a copy of current resume data to update
    const updatedResumeData = { ...resumeData };
    
    // Extract name - improved logic
    let nameFound = false;
    for (let i = 0; i < Math.min(lines.length, 8); i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Skip common header words
      if (lowerLine.includes('resume') || lowerLine.includes('cv') || 
          lowerLine.includes('curriculum') || lowerLine.length < 2) {
        continue;
      }
      
      if (lowerLine.includes('name:')) {
        updatedResumeData.name = line.split(':')[1]?.trim().toUpperCase() || line.toUpperCase();
        nameFound = true;
        break;
      } else if (!nameFound && line.length > 2 && line.length < 60 && 
                 !line.includes('@') && !line.match(/\d{3,}/) && 
                 line.split(' ').length <= 5 && 
                 /^[A-Za-z\s.-]+$/.test(line)) {
        updatedResumeData.name = line.toUpperCase();
        nameFound = true;
        break;
      }
    }
    
    // Extract position/title (usually second line or after name)
    for (let i = 1; i < Math.min(lines.length, 8); i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Look for position indicators
      if (lowerLine.includes('engineer') || lowerLine.includes('developer') || 
          lowerLine.includes('manager') || lowerLine.includes('analyst') ||
          lowerLine.includes('designer') || lowerLine.includes('specialist')) {
        updatedResumeData.position = line;
        break;
      }
    }

    // Extract email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
    const emails = textContent.match(emailRegex);
    if (emails && emails.length > 0) {
      updatedResumeData.email = emails[0];
    }
    
    // Extract phone numbers - multiple patterns
    const phonePatterns = [
      /[\+]?[\d\s\-\(\)]{10,}/g,
      /\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g,
      /(\d{3})[-.\s](\d{3})[-.\s](\d{4})/g
    ];
    
    for (const pattern of phonePatterns) {
      const phones = textContent.match(pattern);
      if (phones && phones.length > 0) {
        updatedResumeData.contactInformation = phones[0].trim();
        break;
      }
    }
    
    // Extract social media and websites - map to socialMedia array
    const urlPatterns = {
      linkedin: /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/view\?id=)([a-zA-Z0-9\-]+)/gi,
      github: /(?:github\.com\/)([a-zA-Z0-9\-]+)/gi,
      website: /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9\-]+\.[a-zA-Z]{2,})/gi
    };
    
    // Update social media array
    if (!updatedResumeData.socialMedia) {
      updatedResumeData.socialMedia = [];
    }
    
    Object.entries(urlPatterns).forEach(([key, regex]) => {
      const matches = textContent.match(regex);
      if (matches && matches.length > 0) {
        const cleanUrl = matches[0].replace(/^https?:\/\//, '').replace(/^www\./, '');
        
        // Find existing social media entry or create new one
        let socialIndex = updatedResumeData.socialMedia.findIndex(
          item => item.socialMedia.toLowerCase() === key.toLowerCase()
        );
        
        if (socialIndex === -1) {
          // Add new social media entry
          const socialMediaName = key.charAt(0).toUpperCase() + key.slice(1);
          updatedResumeData.socialMedia.push({
            socialMedia: socialMediaName,
            link: cleanUrl
          });
        } else {
          // Update existing entry
          updatedResumeData.socialMedia[socialIndex].link = cleanUrl;
        }
      }
    });
    
    // Extract address/location
    const addressKeywords = ['address:', 'location:', 'city:', 'state:', 'country:'];
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      for (const keyword of addressKeywords) {
        if (lowerLine.includes(keyword)) {
          updatedResumeData.address = line.split(':')[1]?.trim() || line;
          break;
        }
      }
    }
    
    // Extract summary/objective - improved
    const summaryKeywords = ['summary', 'objective', 'profile', 'about', 'overview', 'professional summary'];
    let summaryText = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      if (summaryKeywords.some(keyword => lowerLine.includes(keyword))) {
        // Look for summary content in the same line first
        if (line.includes(':')) {
          summaryText = line.split(':')[1]?.trim();
        }
        
        // If not found, take the next few lines
        if (!summaryText || summaryText.length < 10) {
          const summaryLines = lines.slice(i + 1, i + 5).filter(l => 
            l.length > 10 && 
            !l.toLowerCase().includes('experience') && 
            !l.toLowerCase().includes('education') &&
            !l.toLowerCase().includes('skills') &&
            !l.includes('@') &&
            !l.match(/^\d{4}/)
          );
          summaryText = summaryLines.join(' ');
        }
        break;
      }
    }
    
    if (summaryText && summaryText.length > 10) {
      updatedResumeData.summary = summaryText.substring(0, 500);
    }
    
    // Extract skills - improved parsing
    const skillsKeywords = ['skills', 'technical skills', 'technologies', 'expertise', 'competencies', 'proficient in'];
    let skillsFound = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      if (skillsKeywords.some(keyword => lowerLine.includes(keyword))) {
        // Check if skills are in the same line
        let skillsText = '';
        if (line.includes(':')) {
          skillsText = line.split(':')[1]?.trim();
        } else {
          // Look at next few lines
          const nextLines = lines.slice(i + 1, i + 3);
          skillsText = nextLines.find(l => 
            l.includes(',') || l.includes('•') || l.includes('-')
          ) || nextLines[0];
        }
        
        if (skillsText) {
          const skills = skillsText
            .split(/[,;|•\-]/)
            .map(s => s.trim())
            .filter(s => s.length > 1 && s.length < 30)
            .slice(0, 15); // Limit to 15 skills
          
          if (skills.length > 0) {
            skillsFound = skills;
            break;
          }
        }
      }
    }
    
    if (skillsFound.length > 0 && updatedResumeData.skills && updatedResumeData.skills.length > 0) {
      updatedResumeData.skills[0].skills = skillsFound;
    }
    
    // Extract work experience - enhanced
    const workKeywords = ['experience', 'employment', 'work history', 'professional experience', 'career'];
    const workExperiences = [];
    let inWorkSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Check if we're entering work experience section
      if (workKeywords.some(keyword => lowerLine.includes(keyword))) {
        inWorkSection = true;
        continue;
      }
      
      // Stop if we hit another major section
      if (inWorkSection && (lowerLine.includes('education') || lowerLine.includes('skills') || 
                           lowerLine.includes('projects') || lowerLine.includes('certifications'))) {
        break;
      }
      
      // Parse work experience entries
      if (inWorkSection && line.length > 10) {
        // Look for company and position patterns
        if (line.includes('|') || (line.match(/\d{4}/) && !lowerLine.includes('graduated'))) {
          const parts = line.split('|').map(p => p.trim());
          if (parts.length >= 2) {
            const position = parts[0].trim();
            const company = parts[1].trim();
            const dates = parts[2] || '';
            
            // Get description from next few lines
            const descLines = lines.slice(i + 1, i + 4).filter(l => 
              l.startsWith('-') || l.startsWith('•') || l.length > 20
            );
            
            workExperiences.push({
              company: company,
              position: position,
              description: descLines.join(' ').substring(0, 300),
              keyAchievements: descLines.filter(l => l.startsWith('-') || l.startsWith('•')).join('\n'),
              startYear: extractDate(dates, 'start'),
              endYear: extractDate(dates, 'end')
            });
          }
        }
      }
    }
    
    if (workExperiences.length > 0) {
      updatedResumeData.workExperience = workExperiences.slice(0, 3); // Limit to 3 experiences
    }
    
    // Extract education - enhanced
    const educationKeywords = ['education', 'university', 'college', 'degree', 'bachelor', 'master', 'phd'];
    const educationEntries = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      if (educationKeywords.some(keyword => lowerLine.includes(keyword))) {
        // Look for degree and school patterns
        const nextLines = lines.slice(i, i + 4);
        
        for (const eduLine of nextLines) {
          if (eduLine.includes('University') || eduLine.includes('College') || 
              eduLine.includes('Institute') || eduLine.includes('School')) {
            
            const degreeMatch = eduLine.match(/(Bachelor|Master|PhD|Associates|Doctorate).*?(?:in|of)\s+([^|]+)/i);
            const schoolMatch = eduLine.match(/(University|College|Institute|School)[^|]*/i);
            const dateMatch = eduLine.match(/(\d{4})/g);
            
            educationEntries.push({
              school: schoolMatch ? schoolMatch[0].trim() : eduLine.substring(0, 50),
              degree: degreeMatch ? degreeMatch[0].trim() : 'Degree',
              startYear: dateMatch && dateMatch.length > 1 ? `${dateMatch[0]}-09-01` : '2020-09-01',
              endYear: dateMatch && dateMatch.length > 0 ? `${dateMatch[dateMatch.length - 1]}-06-01` : '2024-06-01'
            });
            break;
          }
        }
        break;
      }
    }
    
    if (educationEntries.length > 0) {
      updatedResumeData.education = educationEntries.slice(0, 2); // Limit to 2 education entries
    }
    
    // Extract projects
    const projectKeywords = ['projects', 'personal projects', 'key projects', 'notable projects'];
    const projects = [];
    let inProjectSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      if (projectKeywords.some(keyword => lowerLine.includes(keyword))) {
        inProjectSection = true;
        continue;
      }
      
      if (inProjectSection && (lowerLine.includes('education') || lowerLine.includes('skills') || 
                              lowerLine.includes('experience') || lowerLine.includes('certifications'))) {
        break;
      }
      
      if (inProjectSection && line.length > 10 && !line.startsWith('-') && !line.startsWith('•')) {
        const descLines = lines.slice(i + 1, i + 3).filter(l => 
          l.startsWith('-') || l.startsWith('•') || l.length > 15
        );
        
        projects.push({
          name: line.substring(0, 50),
          description: descLines.join(' ').substring(0, 200),
          keyAchievements: descLines.filter(l => l.startsWith('-') || l.startsWith('•')).join('\n'),
          startYear: '2023-01-01',
          endYear: '2024-01-01'
        });
      }
    }
    
    if (projects.length > 0) {
      updatedResumeData.projects = projects.slice(0, 3); // Limit to 3 projects
    }
    
    return updatedResumeData;
  };

  // load backup resume data
  const handleLoad = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsLoading(true);
    setFileContent(''); // Clear previous content
    
    try {
      console.log(`Loading file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
      
      const result = await parseFileContent(file);
      setFileContent(result.data);
      
      if (result.type === 'json') {
        // If it's JSON, validate and use as resume data
        if (result.data && typeof result.data === 'object') {
          setResumeData(result.data);
          console.log('JSON resume data loaded successfully');
        } else {
          throw new Error('Invalid JSON resume data format');
        }
      } else {
        // If it's text content, try to extract resume information
        const textContent = typeof result.data === 'string' ? result.data : JSON.stringify(result.data);
        if (textContent && textContent.trim().length > 0) {
          const extractedData = extractResumeData(textContent);
          setResumeData(extractedData);
          console.log('Text content processed and resume data extracted');
        } else {
          throw new Error('No readable content found in the file');
        }
      }
      
      // Show success message without blocking the UI
      setTimeout(() => {
        alert(`✅ File "${file.name}" loaded successfully!\nType: ${result.type.toUpperCase()}\nForm fields have been automatically populated with extracted data.\nCheck the preview panel to see the results.`);
      }, 100);
      
    } catch (error) {
      console.error('File loading error:', error);
      const errorMessage = `❌ Error loading "${file.name}":\n${error.message}\n\nSupported formats: JSON, PDF, DOC, DOCX, TXT, XML, MD`;
      setTimeout(() => {
        alert(errorMessage);
      }, 100);
      setFileContent(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      // Reset the input to allow selecting the same file again
      event.target.value = '';
    }
  };

  // download resume data
  const handleDownload = (data, filename, event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-4 mb-2 justify-center">
        <div className="inline-flex flex-row items-center gap-2">
          <h2 className="text-[1.2rem] text-white">Load Data</h2>
          <label className={`p-2 text-white rounded cursor-pointer transition-colors ${
            isLoading ? 'bg-zinc-600 cursor-not-allowed' : 'bg-zinc-800 hover:bg-zinc-700'
          }`}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <FaCloudUploadAlt className="text-[1.2rem] text-white" />
            )}
            <input
              aria-label="Load Data"
              type="file"
              className="hidden"
              onChange={handleLoad}
              accept=".json,.pdf,.doc,.docx,.text,.txt,.xml,.md"
              disabled={isLoading}
            />
          </label>
        </div>
        <div className="inline-flex flex-row items-center gap-2">
          <h2 className="text-[1.2rem] text-white">Save Data</h2>
          <button
            aria-label="Save Data"
            className="p-2 text-white bg-zinc-800 rounded hover:bg-zinc-700 transition-colors"
            onClick={(event) =>
              handleDownload(
                resumeData,
                resumeData.name + " - Profocto.json",
                event
              )
            }
          >
            <FaCloudDownloadAlt className="text-[1.2rem] text-white" />
          </button>
        </div>
      </div>
      
      {/* Supported File Types Info */}
      <div className="mt-2 text-center">
        <p className="text-xs text-zinc-400">
          Supports: JSON, PDF, DOC, DOCX, TXT, XML, MD files
        </p>
      </div>
    </div>
  );
};

export default LoadUnload;