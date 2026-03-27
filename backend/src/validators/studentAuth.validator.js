import { z } from 'zod';

export const loginSchema = z.object({
  token: z.string().min(1, 'Token is required')
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  mobile: z.string().min(10).max(15).optional(),
  college: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  profilePicture: z.string().optional()
});

export const syncProgressSchema = z.object({
  answers: z.record(z.union([z.string(), z.number(), z.null(), z.undefined()])).default({}),
  testId: z.string().optional(),
  timeLeft: z.number().optional()
});

export const logViolationSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});

export const submitTestSchema = z.object({
  answers: z.record(z.union([z.string(), z.number(), z.null(), z.undefined()])).default({}),
  testId: z.string().optional(),
  submissionType: z.string().optional(),
  reason: z.string().max(1000, 'Reason too long').optional(),
  timeLeft: z.number().optional()
});
