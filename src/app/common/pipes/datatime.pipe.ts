import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datatime',
  standalone: true
})
export class DatatimePipe implements PipeTransform {

  transform(time: number, type: string): string {
    if(type === 'h:mm:ss'){
        const h: number = Math.floor(time / 3600);
        const m: number = Math.floor((time % 3600) / 60);
        const s: number = Math.floor(time % 60);
        return (h > 0 ? h + ':' : '') + ( m >= 10 ? '' + m : '0' + m ) + ':' + ( s >= 10 ? '' + s : '0' + s );
    }
    return '';
  }

}
