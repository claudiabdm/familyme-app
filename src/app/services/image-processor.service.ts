import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {

  constructor() { }

  compressImg(file: File): Observable<any> {
    const width = 600; // For scaling relative to width
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return Observable.create(observer => {
      reader.onload = ev => {
        const img = new Image();
        img.src = (ev.target as any).result;
        (img.onload = () => {
          const elem = document.createElement('canvas'); // Use Angular's Renderer2 method
          const scaleFactor = width / img.width;
          elem.width = width;
          elem.height = img.height * scaleFactor;
          const ctx = <CanvasRenderingContext2D>elem.getContext('2d');
          this.getOrientation(file, (orientation) => {
            if (orientation > 2) {
              ctx.translate(elem.width / 2, elem.height / 2);
              switch (orientation) {
                case 3:
                case 4:
                  ctx.rotate(180 * Math.PI / 180);
                case 5:
                case 6:
                  ctx.rotate(90 * Math.PI / 180);
                  break;
                case 7:
                case 8:
                  ctx.rotate(-90 * Math.PI / 180);
                  break;
                default:
                  break;
              }
              ctx.drawImage(img, -elem.width / 2, -elem.height / 2, width, (img.height * scaleFactor));
            } else {
              ctx.drawImage(img, 0, 0, width, (img.height * scaleFactor));
            }
            let compressedImg = ctx.canvas.toDataURL('image/jpeg');
            observer.next(compressedImg);
          });
        }),
          (reader.onerror = error => observer.error(error));
      };
    });
  }

  private getOrientation(file: File, callback: Function) {
    var reader = new FileReader();

    reader.onload = (event: ProgressEvent) => {

      if (!event.target) {
        return;
      }

      const file = event.target as FileReader;
      const view = new DataView(file.result as ArrayBuffer);

      if (view.getUint16(0, false) != 0xFFD8) {
        return callback(-2);
      }

      const length = view.byteLength
      let offset = 2;

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
        let marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xFFE1) {
          if (view.getUint32(offset += 2, false) != 0x45786966) {
            return callback(-1);
          }

          let little = view.getUint16(offset += 6, false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + (i * 12), little) == 0x0112) {
              return callback(view.getUint16(offset + (i * 12) + 8, little));
            }
          }
        } else if ((marker & 0xFF00) != 0xFF00) {
          break;
        }
        else {
          offset += view.getUint16(offset, false);
        }
      }
      return callback(-1);
    };

    reader.readAsArrayBuffer(file);
  }
}
