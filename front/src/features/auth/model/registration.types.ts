import { z } from 'zod';

export const RegistrationSchema = z.object({
  name: z
    .string({ message: 'Введите имя' })
    .min(2, 'Имя должно содержать минимум 2 символа'),
  password: z
    .string({ message: 'Введите пароль' })
    .min(6, 'Пароль должен содержать минимум 6 символов'),
  email: z.string().email('Введите корректный email'),
});

export type RegistrationData = z.infer<typeof RegistrationSchema>;
