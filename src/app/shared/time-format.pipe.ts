import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from "@angular/common";


@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(date: string): string {
    const inputDate = new Date(date);
    const currentDate = new Date();
    const diffInDays = (currentDate.getTime() - inputDate.getTime()) / (60 * 60 * 24 * 1000);
    const inputTime = this.setTimeStr(inputDate.getHours(), inputDate.getMinutes());

    if (inputDate.toDateString() === currentDate.toDateString()) {
      return `Today at ${inputTime}`;
    }
    if (diffInDays < 2) {
      return `Yesterday at ${inputTime}`;
    }
    return formatDate(inputDate, 'dd/MM/yyyy HH:mm', 'en-UK');
  }

  private setTimeStr(hours: number, minutes: number): string {
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

}
