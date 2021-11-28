import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords',
})
export class TruncateWordsPipe implements PipeTransform {
  transform(
    value: string,
    limit = 125,
    completeWords = false,
    ellipsis = '...'
  ) {
    if (completeWords) {
      limit = value.substr(0, limit).lastIndexOf(' ');
    }
    return `${value.substr(0, limit)}${ellipsis}`;
  }
}
