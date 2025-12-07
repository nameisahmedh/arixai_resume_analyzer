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
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        if (result.value && result.value.trim().length > 0) {
          return result.value.trim();
        }
      } catch (mammothError) {
        console.warn(`Mammoth parsing failed for ${file.originalname}, attempting text extraction...`);
      }
      
      // Fallback: Extract text from DOC/DOCX buffer
      // This works for many Office files by extracting readable ASCII/Unicode text
      const buffer = file.buffer;
      let text = '';
      
      // Try to extract text using multiple strategies
      // Strategy 1: Look for UTF-16 encoded text (common in DOC files)
      try {
        const utf16Text = buffer.toString('utf16le').replace(/\0/g, '');
        if (utf16Text.length > 100) {
          text = utf16Text;
        }
      } catch (e) {
        // Strategy 2: UTF-8 extraction with binary filtering
        text = buffer.toString('utf-8', 0, buffer.length);
      }
      
      // Clean up the extracted text
      const cleanText = text
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, ' ') // Remove control characters
        .replace(/[^\w\s.,;:\-()@]/g, ' ') // Keep only reasonable characters
        .replace(/\s+/g, ' ') // Collapse multiple spaces
        .trim();
      
      if (cleanText.length > 30) {
        return cleanText;
      }
      
      throw new Error('Could not extract text from DOC/DOCX file');
    } else if (fileExt === 'txt') {
      return file.buffer.toString('utf-8').trim();
    } else {
      throw new Error(`Unsupported file type: ${fileExt}`);
    }
  } catch (error) {
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
