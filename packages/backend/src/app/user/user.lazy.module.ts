import { DynamicModule } from '@nestjs/common';

import { UserModule } from './user.module';


export function UserLazyModule(): DynamicModule {
  return {
    module: UserModule,
    imports: [UserModule],
  };
}
