import { User } from '@prisma/client';

export type AuthRequest = { auth: { user: User } };
