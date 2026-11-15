// Copia o contrato do back (../carcheck-api/openapi.json, ou o caminho
// passado como argumento) para api/openapi.json e regenera
// src/api/schema.d.ts. Uso: npm run api:sync [-- <caminho do openapi.json>]
//
// Gera os tipos a partir da origem antes de gravar qualquer coisa: se o
// contrato for inválido, nenhum dos dois arquivos muda.
import { access, copyFile, writeFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import {
  CONTRACT_PATH,
  generateSchema,
  ROOT,
  SCHEMA_PATH,
} from './api-generate.mjs';

const source = resolve(
  process.argv[2] ?? resolve(ROOT, '..', 'carcheck-api', 'openapi.json'),
);

try {
  await access(source);
} catch {
  console.error(
    `Contrato do back não encontrado em ${source}.\n` +
      'Clone o carcheck-api ao lado deste repositório (../carcheck-api) e ' +
      'rode `npm run openapi` lá, ou passe o caminho do openapi.json: ' +
      '`npm run api:sync -- <caminho>`.',
  );
  process.exit(1);
}

const schema = await generateSchema(source);
await copyFile(source, CONTRACT_PATH);
await writeFile(SCHEMA_PATH, schema, 'utf8');

console.log(`Contrato copiado de ${source}`);
console.log(
  `Atualizados: ${relative(ROOT, CONTRACT_PATH)} e ${relative(ROOT, SCHEMA_PATH)}`,
);
console.log('Commite os dois arquivos juntos.');
