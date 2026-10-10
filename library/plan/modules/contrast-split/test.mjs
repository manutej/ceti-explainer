import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { testModule } from '../../core/test_module.mjs';
testModule(join(dirname(fileURLToPath(import.meta.url)), 'demo.json'));
