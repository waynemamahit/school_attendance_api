import { Module, ModuleMetadata } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AbsentModule } from './absent/absent.module';
import { AuthModule } from './auth/auth.module';
import { ClassModule } from './class/class.module';
import { CourseModule } from './course/course.module';
import { ScheduleModule } from './schedule/schedule.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

export const appModuleConfig: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    AbsentModule,
    AuthModule,
    ClassModule,
    CourseModule,
    ScheduleModule,
    StudentModule,
    TeacherModule,
  ],
};
@Module(appModuleConfig)
export class AppModule {}
