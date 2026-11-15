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

try {
  await access(CONTRACT_PATH);
} catch {
  console.error(
    `${relative(ROOT, CONTRACT_PATH)} não existe. Rode \`npm run api:sync\` ` +
      'com o carcheck-api ao lado deste repositório.',
  );
  process.exit(1);
}

const tempDir = await mkdtemp(join(tmpdir(), 'carcheck-api-check-'));
const tempSchema = join(tempDir, 'schema.d.ts');

try {
  const expected = await writeSchema(CONTRACT_PATH, tempSchema);
  let committed;
  try {
    committed = (await readFile(SCHEMA_PATH, 'utf8')).replace(/\r\n/g, '\n');
  } catch {
    console.error(
      `${relative(ROOT, SCHEMA_PATH)} não existe. Rode \`npm run api:sync\`.`,
    );
    process.exit(1);
  }
  if (committed !== expected) {
    console.error(
      `${relative(ROOT, SCHEMA_PATH)} está desatualizado em relação a ` +
        `${relative(ROOT, CONTRACT_PATH)}.\n` +
        'Não edite o schema.d.ts à mão: rode `npm run api:sync` e commite ' +
        'api/openapi.json e src/api/schema.d.ts juntos.',
    );
    process.exit(1);
  }
  console.log(
    `${relative(ROOT, SCHEMA_PATH)} confere com ${relative(ROOT, CONTRACT_PATH)}.`,
  );
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
