import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração de CORS
  app.enableCors({
    origin: 'http://localhost:43779',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

const config = new DocumentBuilder()
    .setTitle('CRM Backend Service API - NestJS')
    .setDescription('API documentation for the CRM Backend Service built with NestJS')
    .setVersion('1.0')
    .addTag('Api services') // Optional: Add tags for categorization
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: -1,
      },
    });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
