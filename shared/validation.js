import { z } from 'zod';

export const NAME_MIN = 1;
export const NAME_MAX = 80;
export const MESSAGE_MIN = 1;
export const MESSAGE_MAX = 1000;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const submissionFieldsSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(NAME_MIN, 'Name is required')
    .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters`),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(MESSAGE_MIN, 'Message is required')
    .max(MESSAGE_MAX, `Message must be at most ${MESSAGE_MAX} characters`),
});

export const fileMetaSchema = z
  .object({
    size: z.number().int().nonnegative(),
  })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File must be at most ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
  });

export const validateFields = (values) => {
  const result = submissionFieldsSchema.safeParse(values);
  if (result.success) {
    return { success: true, data: result.data, errors: {} };
  }
  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { success: false, data: null, errors };
};

export const validateFile = (file) => {
  if (!file) return null;
  const result = fileMetaSchema.safeParse({ size: file.size });
  if (result.success) return null;
  return result.error.issues[0]?.message || 'Invalid file';
};
