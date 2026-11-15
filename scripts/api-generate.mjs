// Geração dos tipos da API, compartilhada por api-sync.mjs e api-check.mjs
// para que os dois produzam exatamente o mesmo texto.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const CONTRACT_PATH = resolve(ROOT, 'api', 'openapi.json');
export const SCHEMA_PATH = resolve(ROOT, 'src', 'api', 'schema.d.ts');

const HEADER = `/**
 * Gerado pelo openapi-typescript a partir de api/openapi.json.
 * Não edite à mão: rode \`npm run api:sync\` (contrato novo do back) e
 * commite api/openapi.json e este arquivo juntos.
 */

`;

/** Gera o texto do schema.d.ts a partir de um openapi.json. */
export async function generateSchema(contractPath) {
  const ast = await openapiTS(pathToFileURL(contractPath), { silent: true });
  return HEADER + astToString(ast).replace(/\r\n/g, '\n');
}

/** Gera o schema.d.ts e grava em `outputPath`. */
export async function writeSchema(contractPath, outputPath) {
  const contents = await generateSchema(contractPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, contents, 'utf8');
  return contents;
}
