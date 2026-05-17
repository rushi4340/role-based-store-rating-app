import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // This enables DTO validation globally
  // Without this, class-validator decorators won't work
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,   // strips fields not in the DTO
    transform: true,   // auto-converts types (string "5" → number 5)
  }));

  // Enable CORS so frontend can call the API
  app.enableCors();

  await app.listen(3000);
  console.log('Server running on http://localhost:3000');
}
bootstrap();
