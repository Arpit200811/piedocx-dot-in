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
  // Allows record where values can be string, null or undefined (for skipped questions)
  answers: z.record(z.union([z.string(), z.null(), z.undefined()])).refine(obj => Object.keys(obj).length <= 200, 'Too many answers').default({}),
  testId: z.string().optional(),
  timeLeft: z.number().optional()
});

export const logViolationSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});

export const submitTestSchema = z.object({
  answers: z.record(z.union([z.string(), z.null(), z.undefined()])).refine(obj => Object.keys(obj).length <= 200, 'Too many answers').default({}),
  testId: z.string().optional(),
  submissionType: z.enum(['normal', 'terminated', 'system_closed', 'timeout', 'Manual Submit']).optional(),
  reason: z.string().max(500, 'Reason too long').optional()
});
