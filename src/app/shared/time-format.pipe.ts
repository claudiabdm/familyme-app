import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from "@angular/common";


@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(date: string): string {
    const inputDate = new Date(date);
    const currentDate = new Date();

    if (inputDate.getDay() === currentDate.getDay()) {
      return `Today at ${inputDate.getHours()}:${inputDate.getMinutes()}`;
    }

    if (inputDate.getDay() - currentDate.getDay() === -1) {
      return `Yesterday at ${inputDate.getHours()}:${inputDate.getMinutes()}`;
    }
    return formatDate(inputDate, 'dd/MM/yyyy HH:mm', 'en-UK');
  }

}
