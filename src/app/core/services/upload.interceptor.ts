import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const uploadInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'POST' && req.url === '/api/upload') {
    const formData = req.body as FormData;
    const file = formData?.get('files') as File | null;

    if (file) {
      const blobUrl = URL.createObjectURL(file);
      return of(
        new HttpResponse({
          status: 200,
          body: { files: [{ name: file.name, size: file.size, url: blobUrl }] },
        })
      );
    }

    return of(new HttpResponse({ status: 400 }));
  }

  return next(req);
};
