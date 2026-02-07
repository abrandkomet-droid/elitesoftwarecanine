import { z } from 'zod';
import { insertDogSchema, insertEventSchema, insertHealthRecordSchema, dogs, events, healthRecords, breeds, showResults } from './schema';

// === SHARED ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  dogs: {
    list: {
      method: 'GET' as const,
      path: '/api/dogs' as const,
      input: z.object({
        search: z.string().optional(),
        breedId: z.coerce.number().optional(),
        ownerId: z.string().optional(),
        limit: z.coerce.number().optional(),
        offset: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<any>()), // Using any for recursive types/relations to avoid excessive recursion in Zod
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/dogs/:id' as const,
      responses: {
        200: z.custom<any>(), // DogWithRelations
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/dogs' as const,
      input: insertDogSchema,
      responses: {
        201: z.custom<typeof dogs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/dogs/:id' as const,
      input: insertDogSchema.partial(),
      responses: {
        200: z.custom<typeof dogs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    getPedigree: {
      method: 'GET' as const,
      path: '/api/dogs/:id/pedigree' as const,
      input: z.object({
        generations: z.coerce.number().default(4),
      }).optional(),
      responses: {
        200: z.custom<any>(), // Pedigree tree
        404: errorSchemas.notFound,
      },
    },
  },
  breeds: {
    list: {
      method: 'GET' as const,
      path: '/api/breeds' as const,
      responses: {
        200: z.array(z.custom<typeof breeds.$inferSelect>()),
      },
    },
  },
  events: {
    list: {
      method: 'GET' as const,
      path: '/api/events' as const,
      responses: {
        200: z.array(z.custom<typeof events.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/events' as const,
      input: insertEventSchema,
      responses: {
        201: z.custom<typeof events.$inferSelect>(),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/events/:id' as const,
      responses: {
        200: z.custom<typeof events.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  healthRecords: {
    create: {
      method: 'POST' as const,
      path: '/api/health-records' as const,
      input: insertHealthRecordSchema,
      responses: {
        201: z.custom<typeof healthRecords.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
