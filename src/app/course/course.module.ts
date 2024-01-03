import { Module, ModuleMetadata } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { AbilityModule } from '../ability/ability.module';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class/class.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

export const courseModuleMeta: ModuleMetadata = {
  imports: [AuthModule, AbilityModule, ClassModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
  exports: [CourseService],
};

@Module(courseModuleMeta)
export class CourseModule {}
