import { Pipe, PipeTransform } from '@angular/core';
import { parseUserAgent } from '../utils/display';

@Pipe({
  name: 'userAgentParser',
  standalone: true,
})
export class UserAgentParserPipe implements PipeTransform {
  transform(value: string): string {
    return parseUserAgent(value);
  }
}
