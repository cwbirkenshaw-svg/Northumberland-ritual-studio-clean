const fs = require('fs');
const path = require('path');

const comment = `/**
 * MASTER RITUAL FILE
 *
 * This file contains the authoritative ritual wording for this working.
 *
 * DO NOT MODIFY for learning tools, prompts, summaries, accessibility modes,
 * memory aids, practice copies, or alternative display versions.
 *
 * Any derived or learning version must be stored separately under:
 * src/learning/
 */
`;

function addCommentToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('/**\n * MASTER RITUAL FILE')) {
    fs.writeFileSync(filePath, comment + content);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      addCommentToFile(fullPath);
    }
  }
}

processDirectory(path.join(process.cwd(), 'src/rituals/northumberland'));

// Create emulation structure
const degrees = ['firstDegree', 'secondDegree', 'thirdDegree'];
const offices = ['wm', 'sw', 'jw', 'sd', 'jd', 'ig', 'tyler', 'chaplain', 'dc'];

for (const degree of degrees) {
  const emulationDir = path.join(process.cwd(), 'src/rituals/emulation', degree);
  fs.mkdirSync(emulationDir, { recursive: true });
  
  for (const office of offices) {
    const filePath = path.join(emulationDir, `${office}.ts`);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, `${comment}import { RitualSection } from '../../../../types';\n\nexport const ${office.toUpperCase()}_RITUALS: RitualSection[] = [];\n`);
    }
  }
  
  const indexFilePath = path.join(emulationDir, 'index.ts');
  if (!fs.existsSync(indexFilePath)) {
    const imports = offices.map(o => `import { ${o.toUpperCase()}_RITUALS } from './${o}';`).join('\n');
    const exports = offices.map(o => `  ...${o.toUpperCase()}_RITUALS,`).join('\n');
    const degreeName = degree === 'firstDegree' ? 'FIRST' : degree === 'secondDegree' ? 'SECOND' : 'THIRD';
    fs.writeFileSync(indexFilePath, `${comment}import { RitualSection } from '../../../../types';\n${imports}\n\nexport const ${degreeName}_DEGREE_RITUALS: RitualSection[] = [\n${exports}\n];\n`);
  }
}

// Create emulation index
const emulationIndex = path.join(process.cwd(), 'src/rituals/emulation/index.ts');
if (!fs.existsSync(emulationIndex)) {
  fs.writeFileSync(emulationIndex, `${comment}export * from './firstDegree';\nexport * from './secondDegree';\nexport * from './thirdDegree';\n`);
}

// Create learning structure
const workings = ['northumberland', 'emulation'];
for (const working of workings) {
  for (const degree of degrees) {
    const learningDir = path.join(process.cwd(), 'src/learning', working, degree);
    fs.mkdirSync(learningDir, { recursive: true });
    
    const indexFilePath = path.join(learningDir, 'index.ts');
    if (!fs.existsSync(indexFilePath)) {
      fs.writeFileSync(indexFilePath, `import { RitualSection } from '../../../../types';\n\n// Learning copies derived from master rituals\nexport const LEARNING_RITUALS: RitualSection[] = [];\n`);
    }
  }
}
