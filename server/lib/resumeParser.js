import mammoth from 'mammoth';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Parses resume file and extracts text content
 * 
 * Supports multiple file formats (PDF, DOCX, TXT) and extracts raw text content.
 * Uses pdf-parse for PDF files, mammoth for DOCX files, and utf-8 decoding for TXT files.
 * 
 * @async
 * @param {Object} file - Multer file object from upload
 * @param {Buffer} file.buffer - File content as binary buffer
 * @param {string} file.originalname - Original filename with extension
 * @returns {Promise<string>} Extracted text content from resume
 * 
 * @throws {Error} If file format is unsupported or parsing fails
 * 
 * @example
 * const resumeText = await parseResume(multerFile);
 * console.log('Extracted text:', resumeText);
 */
export async function parseResume(file) {
  const fileExt = file.originalname.split('.').pop()?.toLowerCase();

  try {
    if (fileExt === 'pdf') {
      const data = await pdfParse(file.buffer);
      return data.text.trim();
    } else if (fileExt === 'docx' || fileExt === 'doc') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      return result.value.trim();
    } else if (fileExt === 'txt') {
      return file.buffer.toString('utf-8').trim();
    } else {
      throw new Error(`Unsupported file type: ${fileExt}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
