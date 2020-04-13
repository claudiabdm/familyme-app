import { TestBed } from '@angular/core/testing';

import { ImageProcessorService } from './image-processor.service';

describe('ImageProcessorService', () => {
  let service: ImageProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
