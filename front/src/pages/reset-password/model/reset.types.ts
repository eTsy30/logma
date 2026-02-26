import z from 'zod';

export const ResetSchema = z
  .object({
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type ResetFormData = z.infer<typeof ResetSchema>;
