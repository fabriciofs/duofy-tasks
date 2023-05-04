import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import NodeCache from 'node-cache';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new NodeCache();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [method, key, uuid] = this.createCacheKey(context);
    const request = context.switchToHttp().getRequest();
    const cachedData = uuid ? this.cache.get(key) : null;
    if (request.method === 'GET' && cachedData) {
      console.log({ cachedData });
      return of(cachedData);
    }
    return next.handle().pipe(
      tap((data) => {
        if (method === 'POST') {
          this.cache.set(`${key}/${data.id}`, data);
        } else if (uuid) {
          this.cache.set(key, data);
        }
      }),
    );
  }

  private createCacheKey(context: ExecutionContext): string[] {
    const request = context.switchToHttp().getRequest();
    const regex =
      /.*\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/;
    const match = request.url.match(regex);
    let uuid = null;
    if (match) {
      uuid = match[1];
    }
    const { method, url } = request;
    return [method, url, uuid];
  }
}
