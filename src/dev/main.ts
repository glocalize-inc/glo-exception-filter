import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionWithMessageFilter } from '../lib';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionWithMessageFilter());
  await app.listen(3000);
}
bootstrap();
