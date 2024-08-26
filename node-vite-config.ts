import { deepkitType } from '@deepkit/vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { join } from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import { defineConfig, PluginOption } from 'vite';

export interface NodeViteConfigOptions {
  readonly root: string;
  readonly plugins?: readonly PluginOption[];
  readonly debug?: boolean;
}

export function defineNodeConfig({
  root,
  plugins,
  debug,
}: NodeViteConfigOptions) {
  return defineConfig(({ mode }) => {
    const tsConfig =
      mode === 'test'
        ? join(root, 'tsconfig.spec.json')
        : join(root, 'tsconfig.app.json');

    const projectPathFromWorkspaceRoot = root.replace(`${workspaceRoot}/`, '');

    const buildLibsFromSource = process.env.NX_TASK_TARGET_TARGET === 'serve';

    const envVars = Object.entries(process.env).reduce(
      (defs, [key, value]) => ({
        ...defs,
        [`import.meta.env.${key}`]: JSON.stringify(value),
      }),
      {},
    );

    return {
      root,
      cacheDir: `${workspaceRoot}/node_modules/.vite/${projectPathFromWorkspaceRoot}`,
      build: {
        minify: mode === 'production',
        outDir: `${workspaceRoot}/dist/${projectPathFromWorkspaceRoot}`,
        emptyOutDir: true,
        rollupOptions: {
          preserveEntrySignatures: 'strict',
          output: {
            esModule: true,
            entryFileNames: `[name].mjs`,
          },
        },
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      resolve: {
        mainFields: ['module'],
      },
      plugins: [
        deepkitType({
          tsConfig,
          compilerOptions: {
            sourceMap: true,
          },
        }),
        nxViteTsPaths({
          debug,
          buildLibsFromSource,
        }),
        ...(plugins || []),
      ],
      test: {
        passWithNoTests: true,
        environment: 'node',
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
          reportsDirectory: join(
            workspaceRoot,
            'coverage',
            projectPathFromWorkspaceRoot,
          ),
          provider: 'v8',
        },
        isolate: false,
        cache: {
          dir: join(workspaceRoot, 'node_modules/.cache/vitest'),
        },
      },
      define: {
        'import.meta.vitest': mode === 'test',
        'import.meta.env.NX_WORKSPACE_ROOT': JSON.stringify(workspaceRoot),
        ...envVars,
      },
    };
  });
}
