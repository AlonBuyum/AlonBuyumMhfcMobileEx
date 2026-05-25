import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').trim(),
  content: z.string().max(5000, 'Content too long').optional().default(''),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type CreateNoteFormValues = z.infer<typeof createNoteSchema>;
