import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend('re_Pjax8uMv_LHM1qLu5oZR3UAQvW8HF5B7d');
}
