import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable global validation pipe with custom message for unknown fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (validationErrors = []) => {
        // Collect properties flagged as non-whitelisted
        const unknownProps: string[] = [];
        const collect = (errors: any[]) => {
          for (const err of errors) {
            if (err.constraints && err.constraints.forbidNonWhitelisted) {
              unknownProps.push(err.property);
            }
            if (err.children && err.children.length) {
              collect(err.children);
            }
          }
        };
        collect(validationErrors as any[]);

        if (unknownProps.length) {
          return new BadRequestException(`Unknown properties: ${unknownProps.join(', ')}`);
        }

        // Fallback to default validation messages
        const messages = (validationErrors as any[])
          .map(err => Object.values(err.constraints || {}).join(', '))
          .filter(Boolean)
          .join(', ');
        return new BadRequestException(messages || 'Validation failed');
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


