import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';
import { importPptxBufferToDocument, type PptxImportReport } from '../core/pptx-adapter.ts';
import type { PresentationDocument } from '../core/schema.ts';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'font/woff2',
  'font/ttf',
  'font/otf',
  'application/octet-stream', // checked against extension
]);

export function sanitizeSvgContent(svgText: string): string {
  return svgText
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/javascript:/gi, '');
}

export async function ensureUploadDir(): Promise<void> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export function inferAssetKind(filename: string, mime: string): 'image' | 'pdf' | 'pptx' | 'docx' | 'font' | 'other' {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf') || mime === 'application/pdf') return 'pdf';
  if (lower.endsWith('.pptx') || mime.includes('presentationml')) return 'pptx';
  if (lower.endsWith('.docx') || mime.includes('wordprocessingml')) return 'docx';
  if (/\.(png|jpg|jpeg|webp|svg)$/i.test(lower) || mime.startsWith('image/')) return 'image';
  if (/\.(woff2?|ttf|otf)$/i.test(lower) || mime.startsWith('font/')) return 'font';
  return 'other';
}

export async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const zip = await JSZip.loadAsync(buffer);
    const docXml = zip.files['word/document.xml'];
    if (!docXml) return '';
    const xml = await docXml.async('text');
    const paragraphs = xml.split(/<\/w:p>/).map((p) => {
      const texts = [...p.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)].map((m) => m[1]);
      return texts.join('');
    });
    return paragraphs.map((p) => p.trim()).filter(Boolean).join('\n\n');
  } catch {
    return '';
  }
}

export async function storeAndProcessUploadedFile(file: {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}): Promise<{
  id: string;
  kind: 'image' | 'pdf' | 'pptx' | 'docx' | 'font' | 'other';
  storagePath: string;
  publicUrl: string;
  extractedText: string;
  importedDocument?: PresentationDocument;
  importReport?: PptxImportReport;
}> {
  await ensureUploadDir();
  const id = `asset-${crypto.randomUUID().slice(0, 12)}`;
  const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const safeName = `${id}${ext}`;
  const fullPath = path.join(UPLOAD_DIR, safeName);

  let bufferToWrite = file.buffer;
  if (ext === '.svg' || file.mimetype === 'image/svg+xml') {
    const clean = sanitizeSvgContent(file.buffer.toString('utf8'));
    bufferToWrite = Buffer.from(clean, 'utf8');
  }

  await fs.writeFile(fullPath, bufferToWrite);

  const kind = inferAssetKind(file.originalname, file.mimetype);
  let extractedText = '';
  let importedDocument: PresentationDocument | undefined;
  let importReport: PptxImportReport | undefined;

  if (kind === 'docx') {
    extractedText = await extractDocxText(bufferToWrite);
  } else if (kind === 'pptx') {
    const res = await importPptxBufferToDocument(bufferToWrite, file.originalname);
    importedDocument = res.document;
    importReport = res.report;
    extractedText = res.document.slides
      .map((s, idx) =>
        `Slide ${idx + 1}: ` +
        s.elements
          .filter((e) => e.type === 'text')
          .map((e) => (e.type === 'text' ? e.content : ''))
          .join(' ')
      )
      .join('\n\n');
  } else if (kind === 'other' && (file.mimetype.startsWith('text/') || ext === '.json' || ext === '.csv' || ext === '.md')) {
    extractedText = bufferToWrite.toString('utf8').slice(0, 30000);
  }

  return {
    id,
    kind,
    storagePath: fullPath,
    publicUrl: `/api/assets/file/${safeName}`,
    extractedText,
    importedDocument,
    importReport,
  };
}
