import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseResume(file: Express.Multer.File): Promise<string> {
  const fileExt = file.originalname.split('.').pop()?.toLowerCase();

  try {
    if (fileExt === 'pdf') {
      const data = await (pdfParse as any).default(file.buffer);
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
