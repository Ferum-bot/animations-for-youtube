import {existsSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import {readJson} from './lib.mjs';

/** Explicit grandfathering: a new animation cannot silently inherit a legacy style. */
export const createDesignPolicy = async (root = process.cwd()) => {
  const policy = await readJson(path.join(root, 'config/design-system-policy.json'));
  const legacy = new Set(policy.legacyAnimations);
  const legacyDirectories = policy.legacyAnimations.map(id => {
    const [video, animation] = id.split('/');
    return path.join(root, 'videos', video, 'animations', animation);
  });
  const deprecatedPaths = policy.deprecatedPaths.map(name => path.join(root, name));
  const checked = new Set();
  const errors = [];
  const within = (file, directory) => file === directory || file.startsWith(`${directory}${path.sep}`);
  const relative = file => path.relative(root, file);

  const inspect = async file => {
    if (checked.has(file)) return;
    checked.add(file);
    const code = await readFile(file, 'utf8');
    const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true);
    const imports = [];
    const visit = node => {
      if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
          node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        imports.push(node.moduleSpecifier.text);
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        imports.push(node.arguments[0].text);
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    for (const specifier of imports) {
      if (policy.deprecatedImports.some(name => specifier === name || specifier.startsWith(`${name}/`))) {
        errors.push(`${relative(file)}: deprecated import ${specifier}; use @channel/motion-v2`);
        continue;
      }
      const base = specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) :
        specifier === '@channel/motion-v2' ? path.join(root, 'packages/motion-v2/src/index.ts') : undefined;
      if (!base) continue;
      const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
        .find(candidate => /\.(ts|tsx)$/.test(candidate) && existsSync(candidate));
      if (!target) continue; // TypeScript reports unresolved modules.
      if ([...deprecatedPaths, ...legacyDirectories].some(directory => within(target, directory))) {
        errors.push(`${relative(file)}: imports deprecated visual code ${relative(target)}`);
        continue;
      }
      if (within(file, path.join(root, 'packages')) &&
          ['videos', 'examples', 'apps'].some(directory => within(target, path.join(root, directory)))) {
        errors.push(`${relative(file)}: shared library must not depend on episode/example code`);
        continue;
      }
      await inspect(target);
    }
  };

  return {
    errors,
    async checkAnimation(video, metadata, directory) {
      const id = `${video}/${metadata.id}`;
      if (metadata.designSystem !== undefined && !['v2', 'legacy'].includes(metadata.designSystem)) {
        errors.push(`${id}: unknown designSystem ${metadata.designSystem}`);
      }
      if (metadata.designSystem !== 'v2') {
        if (!legacy.has(id)) errors.push(`${id}: new animations require designSystem: "v2"`);
        return;
      }
      await inspect(path.join(directory, 'Composition.tsx'));
    },
    checkLibrary: () => inspect(path.join(root, 'packages/motion-v2/src/index.ts')),
  };
};
