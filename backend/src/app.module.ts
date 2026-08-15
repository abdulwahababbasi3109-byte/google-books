import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/module/book.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BooksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
