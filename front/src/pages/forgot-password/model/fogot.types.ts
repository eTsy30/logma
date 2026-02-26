import z from 'zod';

export const ForgotSchema = z.object({
  email: z.string().email('Неверный формат email'),
});

export type ForgotFormData = z.infer<typeof ForgotSchema>;
