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

    return {
      root,
      build: {
        minify: mode === 'production',
        rollupOptions: {
          preserveEntrySignatures: 'strict',
          output: {
            esModule: true,
            entryFileNames: `[name].mjs`,
          },
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
        nxViteTsPaths({ debug }),
        ...(plugins || []),
      ],
      test: {
        globals: true,
        passWithNoTests: true,
        environment: 'node',
        include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default', 'hanging-process'],
        coverage: {
          reportsDirectory: join(
            workspaceRoot,
            'coverage',
            projectPathFromWorkspaceRoot,
          ),
          provider: 'v8',
        },
        cache: {
          dir: join(workspaceRoot, 'node_modules/.cache/vitest'),
        },
      },
      define: {
        'import.meta.vitest': mode === 'test',
        'import.meta.env.NX_WORKSPACE_ROOT': JSON.stringify(workspaceRoot),
      },
    };
  });
}
