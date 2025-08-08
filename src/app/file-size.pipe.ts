import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(size: number): string {
    if (!size && size !== 0) return '';
    
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const readableSize = (size / Math.pow(1024, i)).toFixed(2);
    return `${readableSize} ${units[i]}`;
  }

}
