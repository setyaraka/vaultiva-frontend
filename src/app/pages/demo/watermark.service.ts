import { Injectable } from '@angular/core';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';

@Injectable({ providedIn: 'root' })
export class WatermarkService {
    async watermarkImage(file: File, text = 'DEMO · Vaultiva'): Promise<Blob> {
        const bmp = await createImageBitmap(file);
      
        const canvas = document.createElement('canvas');
        canvas.width = bmp.width;
        canvas.height = bmp.height;
      
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(bmp, 0, 0);
      
        const angle = 38 * Math.PI / 180;
        const gap   = Math.round(Math.min(canvas.width, canvas.height) / 2.2);
        const alpha = 0.20;
        const color = 'rgba(70,70,70,1)';
        const fs    = Math.max(18, Math.round(Math.min(canvas.width, canvas.height) / 18));
      
        ctx.globalCompositeOperation = 'multiply';
      
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(angle);
        ctx.translate(-canvas.width/2, -canvas.height/2);
      
        ctx.font = `${fs}px sans-serif`;
        ctx.textBaseline = 'top';
      
        for (let y = -canvas.height; y < canvas.height * 2; y += gap) {
          for (let x = -canvas.width; x < canvas.width * 2; x += gap) {
            ctx.globalAlpha = Math.min(alpha + 0.05, 0.3);
            ctx.strokeStyle = 'rgba(255,255,255,0.22)';
            ctx.lineWidth = Math.max(0.75, fs / 24);
            ctx.strokeText(text, x, y);
      
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      
        return await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/png')!);
    }

    async watermarkPdf(file: File, text = 'DEMO · Vaultiva', maxPages = 10): Promise<Blob> {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const pdf = await PDFDocument.load(bytes, { updateMetadata: false });
        if (pdf.getPageCount() > maxPages) throw new Error(`PDF exceeds ${maxPages} pages for demo.`);
    
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const angle = degrees(38);
        const gap = 260;
        const opacity = 0.20;
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
