import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FloorModule } from './components/floor/floor.module';
import { TableModule } from './components/table/table.module';
import { CategoryModule } from './components/category/category.module';
import { DishModule } from './components/dish/dish.module';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { RoleModule } from './components/role/role.module';
import { CustomerModule } from './components/customer/customer.module';
import { EmployeeModule } from './components/employee/employee.module';
import { OrderModule } from './components/order/order.module';
import { AuthenticationModule } from './components/authentication/authentication.module';
import AppDataSource from './configs/database.config';
import { MulterModule } from '@nestjs/platform-express';
import { multerDiskStorage } from './utils/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    FloorModule,
    TableModule,
    CategoryModule,
    DishModule,
    DashboardModule,
    RoleModule,
    CustomerModule,
    EmployeeModule,
    OrderModule,
    AuthenticationModule,
    MulterModule.register({
      storage: multerDiskStorage,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
