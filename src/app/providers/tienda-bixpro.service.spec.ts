import { TestBed } from '@angular/core/testing';

import { TiendaBixproService } from './tienda-bixpro.service';

describe('TiendaBixproService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TiendaBixproService = TestBed.get(TiendaBixproService);
    expect(service).toBeTruthy();
  });
});
