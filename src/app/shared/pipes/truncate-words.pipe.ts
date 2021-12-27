import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateWords',
})
export class TruncateWordsPipe implements PipeTransform {
  transform(value: string, limit = 130, completeWords = false) {
    let newValue = '';
    const ellipsis = '...';
    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
    }
    if (value.length > limit) {
      newValue = value.substring(0, limit - 1) + '...';
    } else {
      newValue = value;
    }
    return newValue;
  }
}
