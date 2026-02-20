import { z } from 'zod';

export enum RecoveryStatuses {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PROGRESS = 'PROGRESS',
}

export const PasswordRecoverySchema = z.object({
  email: z
    .string()
    .min(1, 'Обязательное поле')
    .email({ message: 'Введите корректный email' }),
});

export const PasswordResetSchema = z
  .object({
    password: z
      .string({
        message: 'Обязательное поле',
      })
      .min(8, 'Минимум 8 символов'),
    confirmPassword: z.string().min(8, 'Минимум 8 символов'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export type PasswordRecoveryData = z.infer<typeof PasswordRecoverySchema>;
export type PasswordResetData = z.infer<typeof PasswordResetSchema>;
