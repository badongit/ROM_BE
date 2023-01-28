import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FloorModule } from './components/floor/floor.module';
import { TableModule } from './components/table/table.module';
import { CategoryModule } from './components/category/category.module';
import { DishModule } from './components/dish/dish.module';
import AppDataSource from './configs/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigModule.forRoot({ isGlobal: true }),
    FloorModule,
    TableModule,
    CategoryModule,
    DishModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
