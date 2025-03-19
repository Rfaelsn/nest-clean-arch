import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

//criado para padronizar o output da api com atrib data {} desconsiderando casos como accessToken e o resultado do tipo Search que retorna meta dados de paginação
@Injectable()
export class WrapperDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((body) => {
        return !body || 'accessToken' in body || 'meta' in body
          ? body
          : { data: body };
      }),
    );
  }
}
