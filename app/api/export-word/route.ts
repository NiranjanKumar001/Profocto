import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { ResumeData } from "@/app/types/resume";

export async function POST(req: NextRequest) {
     try {
          const resumeData = await req.json() as ResumeData;
          const { 
               name, 
               position, 
               contactInformation, 
               email,
               address,
               socialMedia,
               summary, 
               education, 
               workExperience, 
               skills, 
               projects, 
               certifications, 
               languages 
          } = resumeData;

          // Create document paragraphs
          const docParagraphs = [];

          // Header - Name and Position
          if (name) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: name, bold: true, size: 32 })],
                         heading: HeadingLevel.TITLE,
                         alignment: "center"
                    })
               );
          }

          if (position) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: position, size: 24, italics: true })],
                         alignment: "center"
                    })
               );
          }

          // Add spacing
          docParagraphs.push(new Paragraph({ text: "" }));

          // Contact Information
          if (contactInformation || email || address) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "CONTACT INFORMATION", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               const contactLines = [];
               if (email) contactLines.push(`Email: ${email}`);
               if (contactInformation) contactLines.push(`Contact: ${contactInformation}`);
               if (address) contactLines.push(`Address: ${address}`);

               // Add social media links
               if (socialMedia && socialMedia.length > 0) {
                    socialMedia.forEach(social => {
                         if (social.socialMedia && social.link) {
                              contactLines.push(`${social.socialMedia}: ${social.link}`);
                         }
                    });
               }

               contactLines.forEach(line => {
                    docParagraphs.push(new Paragraph({ text: line }));
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Summary
          if (summary) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );
               docParagraphs.push(new Paragraph({ text: summary }));
               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Work Experience
          if (workExperience && workExperience.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "WORK EXPERIENCE", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               workExperience.forEach((exp, index) => {
                    if (exp.position) {
                         docParagraphs.push(
                              new Paragraph({
                                   children: [
                                        new TextRun({ text: exp.position, bold: true, size: 20 }),
                                        new TextRun({ text: exp.company ? ` - ${exp.company}` : "", size: 20 })
                                   ]
                              })
                         );
                    }

                    if (exp.startYear || exp.endYear) {
                         const dateRange = `${exp.startYear || ''} ${exp.endYear ? `- ${exp.endYear}` : '- Present'}`;
                         docParagraphs.push(new Paragraph({ 
                              children: [new TextRun({ text: dateRange, italics: true })] 
                         }));
                    }

                    if (exp.description) {
                         docParagraphs.push(new Paragraph({ text: exp.description }));
                    }

                    if (exp.keyAchievements) {
                         docParagraphs.push(new Paragraph({ text: `Key Achievements: ${exp.keyAchievements}` }));
                    }

                    if (index < workExperience.length - 1) {
                         docParagraphs.push(new Paragraph({ text: "" }));
                    }
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Education
          if (education && education.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "EDUCATION", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               education.forEach((edu, index) => {
                    if (edu.degree) {
                         docParagraphs.push(
                              new Paragraph({
                                   children: [
                                        new TextRun({ text: edu.degree, bold: true, size: 20 }),
                                        new TextRun({ text: edu.school ? ` - ${edu.school}` : "", size: 20 })
                                   ]
                              })
                         );
                    }

                    if (edu.startYear || edu.endYear) {
                         const dateRange = `${edu.startYear || ''} ${edu.endYear ? `- ${edu.endYear}` : '- Present'}`;
                         docParagraphs.push(new Paragraph({ 
                              children: [new TextRun({ text: dateRange, italics: true })] 
                         }));
                    }

                    if (index < education.length - 1) {
                         docParagraphs.push(new Paragraph({ text: "" }));
                    }
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Skills
          if (skills && skills.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "SKILLS", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               skills.forEach((skillGroup, index) => {
                    if (skillGroup.title) {
                         docParagraphs.push(
                              new Paragraph({
                                   children: [new TextRun({ text: skillGroup.title, bold: true })]
                              })
                         );
                    }
                    if (skillGroup.skills && skillGroup.skills.length > 0) {
                         const skillsList = skillGroup.skills.join(", ");
                         docParagraphs.push(new Paragraph({ text: skillsList }));
                    }
                    if (index < skills.length - 1) {
                         docParagraphs.push(new Paragraph({ text: "" }));
                    }
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Projects
          if (projects && projects.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "PROJECTS", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               projects.forEach((project, index) => {
                    if (project.name) {
                         docParagraphs.push(
                              new Paragraph({
                                   children: [new TextRun({ text: project.name, bold: true, size: 20 })]
                              })
                         );
                    }

                    if (project.startYear || project.endYear) {
                         const dateRange = `${project.startYear || ''} ${project.endYear ? `- ${project.endYear}` : '- Present'}`;
                         docParagraphs.push(new Paragraph({ 
                              children: [new TextRun({ text: dateRange, italics: true })] 
                         }));
                    }

                    if (project.description) {
                         docParagraphs.push(new Paragraph({ text: project.description }));
                    }

                    if (project.keyAchievements) {
                         docParagraphs.push(new Paragraph({ text: `Key Achievements: ${project.keyAchievements}` }));
                    }

                    if (index < projects.length - 1) {
                         docParagraphs.push(new Paragraph({ text: "" }));
                    }
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Certifications
          if (certifications && certifications.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "CERTIFICATIONS", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               certifications.forEach((cert, index) => {
                    if (cert.name) {
                         docParagraphs.push(
                              new Paragraph({
                                   children: [
                                        new TextRun({ text: cert.name, bold: true }),
                                        new TextRun({ text: cert.issuer ? ` - ${cert.issuer}` : "" })
                                   ]
                              })
                         );
                    }

                    if (index < certifications.length - 1) {
                         docParagraphs.push(new Paragraph({ text: "" }));
                    }
               });

               docParagraphs.push(new Paragraph({ text: "" }));
          }

          // Languages
          if (languages && languages.length > 0) {
               docParagraphs.push(
                    new Paragraph({
                         children: [new TextRun({ text: "LANGUAGES", bold: true, size: 24 })],
                         heading: HeadingLevel.HEADING_1
                    })
               );

               const languagesList = languages.join(", ");
               docParagraphs.push(new Paragraph({ text: languagesList }));
          }

          // Create document
          const doc = new Document({
               sections: [{
                    properties: {},
                    children: docParagraphs
               }]
          });

          // Generate buffer
          const buffer = await Packer.toBuffer(doc);

          // Set response headers
          const filename = `${name || 'Resume'} - Profocto.docx`;

          // Return the file as response
          return new NextResponse(new Uint8Array(buffer), {
               status: 200,
               headers: {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Content-Length': buffer.length.toString(),
               },
          });

     } catch (error) {
          console.error('Error generating Word document:', error);
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          return NextResponse.json(
               { message: 'Error generating Word document', error: errorMessage }, 
               { status: 500 }
          );
     }
}