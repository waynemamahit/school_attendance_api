import { faker } from '@faker-js/faker';
import { randomBytes } from 'crypto';
import {
  CourseDto,
  CourseTeacherDto,
} from 'src/shared/pipes/zod/course.validation';

export class CourseE2EMock {
  dto: CourseDto;
  teacherDto: CourseTeacherDto;

  constructor() {
    this.dto = {
      subject_number: randomBytes(24).toString('hex'),
      curriculum: faker.commerce.department(),
      name: faker.company.name(),
      class_id: 1,
    };

    this.teacherDto = {
      course_id: 1,
      teacher_id: 1,
    };
  }
}
