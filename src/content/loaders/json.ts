import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { ZodSchema } from 'zod';

function resolvePath(relativePath: string) {
  return path.join(process.cwd(), relativePath);
}

export async function readJsonFile<T>(relativePath: string, schema: ZodSchema<T>): Promise<T> {
  const filePath = resolvePath(relativePath);
  const raw = await fs.readFile(filePath, 'utf-8');
  const parsed = JSON.parse(raw) as unknown;
  return schema.parse(parsed);
}

export async function readJsonDirectory<T>(relativeDir: string, schema: ZodSchema<T>) {
  const dirPath = resolvePath(relativeDir);
  const files = await fs.readdir(dirPath);
  const jsonFiles = files.filter((file) => file.endsWith('.json')).sort();

  return Promise.all(
    jsonFiles.map(async (file) => {
      const value = await readJsonFile<T>(path.join(relativeDir, file), schema);
      return { file, value };
    })
  );
}
