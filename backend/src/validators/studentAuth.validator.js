/** 
 * 🔥 VERSION 2.1.1 - FIXED BY ANTIGRAVITY 
 * 🚀 CHANGES: Relaxed submissionType and syncProgress constraints for 300+ students 
 * 🧼 WHATSAPP REMOVED: All legacy messaging logic deleted.
 */
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
  answers: z.any().optional(), // Maximum flexibility
  testId: z.any().optional(),
  timeLeft: z.any().optional()
});

export const logViolationSchema = z.object({
  reason: z.string().min(1, 'Reason is required').max(500, 'Reason too long')
});

export const submitTestSchema = z.object({
  answers: z.any().optional(), // Maximum flexibility
  testId: z.any().optional(),
  submissionType: z.any().optional(),
  reason: z.any().optional(),
  timeLeft: z.any().optional()
});
