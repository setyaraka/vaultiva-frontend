import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class WatermarkService {
  async watermarkImage(file: File, text = 'DEMO · Vaultiva'): Promise<Blob> {
    const angle = 38 * Math.PI / 180;
    const gap = 260;
    const alpha = 0.12;

    const bmp = await createImageBitmap(file);
    const c = document.createElement('canvas');
    c.width = bmp.width; c.height = bmp.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(bmp, 0, 0);

    const fs = Math.round(Math.max(14, Math.min(40, c.width / 25)));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#666';
    ctx.font = `${fs}px sans-serif`;
    ctx.textBaseline = 'top';

    ctx.translate(c.width/2, c.height/2);
    ctx.rotate(angle);
    ctx.translate(-c.width/2, -c.height/2);

    for (let y = -c.height; y < c.height*2; y += gap) {
      for (let x = -c.width; x < c.width*2; x += gap) {
        ctx.fillText(text, x, y);
      }
    }
    ctx.restore();

    return new Promise<Blob>(res => c.toBlob(b => res(b!), 'image/png', 0.92)!);
  }

  // PDF → pdf-lib + drawText berulang tiap halaman
  async watermarkPdf(file: File, text = 'DEMO · Vaultiva', maxPages = 10): Promise<Blob> {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
    if (pdf.getPageCount() > maxPages) throw new Error(`PDF exceeds ${maxPages} pages for demo.`);
  
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const angle = degrees(38);
    const gap = 260;
    const opacity = 0.12;
    const size = 20;
  
    for (const page of pdf.getPages()) {
      const { width, height } = page.getSize();
      for (let y = -height; y < height * 2; y += gap) {
        for (let x = -width; x < width * 2; x += gap) {
          page.drawText(text, {
            x, y,
            size,
            rotate: angle,
            font,
            color: rgb(0.45, 0.45, 0.45),
            opacity
          } as any);
        }
      }
    }
  
    const out = await pdf.save();
    const ab = out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength) as ArrayBuffer;
    return new Blob([ab], { type: 'application/pdf' });
  }
}
