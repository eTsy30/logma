import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(1, { message: 'Введите пароль' }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
