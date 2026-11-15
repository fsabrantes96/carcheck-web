// Regenera os tipos a partir de api/openapi.json num arquivo temporário e
// falha (exit 1) se forem diferentes do src/api/schema.d.ts commitado. Não
// depende do repositório do back: roda no CI.
import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import {
  CONTRACT_PATH,
  ROOT,
  SCHEMA_PATH,
  writeSchema,
} from './api-generate.mjs';

const contractName = relative(ROOT, CONTRACT_PATH);
const schemaName = relative(ROOT, SCHEMA_PATH);

/** Devolve a mensagem de erro, ou null se o schema confere. */
async function check() {
  try {
    await access(CONTRACT_PATH);
  } catch {
    return (
      `${contractName} não existe. Rode \`npm run api:sync\` ` +
      'com o carcheck-api ao lado deste repositório.'
    );
  }

  let committed;
  try {
    committed = (await readFile(SCHEMA_PATH, 'utf8')).replace(/\r\n/g, '\n');
  } catch {
    return `${schemaName} não existe. Rode \`npm run api:sync\`.`;
  }

  const tempDir = await mkdtemp(join(tmpdir(), 'carcheck-api-check-'));
  try {
    const expected = await writeSchema(
      CONTRACT_PATH,
      join(tempDir, 'schema.d.ts'),
    );
    if (committed !== expected) {
      return (
        `${schemaName} está desatualizado em relação a ${contractName}.\n` +
        'Não edite o schema.d.ts à mão: rode `npm run api:sync` e commite ' +
        'api/openapi.json e src/api/schema.d.ts juntos.'
      );
    }
    return null;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

const problem = await check();
if (problem) {
  console.error(problem);
  process.exitCode = 1;
} else {
  console.log(`${schemaName} confere com ${contractName}.`);
}
