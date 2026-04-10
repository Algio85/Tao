import fs   from 'node:fs/promises';
import path from 'node:path';

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/stories/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-toolbars', '@tpitre/story-ui'],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: { autodocs: 'tag' },
  staticDirs: ['../public'],

  viteFinal: async (viteConfig) => {
    // ── Story UI: exclude from dep optimisation ───────────────────────────────
    viteConfig.optimizeDeps = {
      ...viteConfig.optimizeDeps,
      exclude: [...(viteConfig.optimizeDeps?.exclude || []), '@tpitre/story-ui'],
    };

    // ── App creator endpoint ──────────────────────────────────────────────────
    // POST /api/create-app  { name: string, files: Record<string,string> }
    // Creates  workspace/apps/<name>/  and writes all supplied files.
    viteConfig.plugins = [
      ...(viteConfig.plugins || []),
      {
        name: 'tao-app-creator',
        configureServer(server) {
          server.middlewares.use('/api/create-app', (req, res) => {
            res.setHeader('Content-Type', 'application/json');

            if (req.method !== 'POST') {
              res.statusCode = 405;
              return res.end(JSON.stringify({ error: 'Method not allowed' }));
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { name, files } = JSON.parse(body);

                // Sanitise — no path traversal, no uppercase
                const safeName = name
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, '-')
                  .replace(/-+/g, '-')
                  .replace(/^-|-$/g, '');

                if (!safeName) throw new Error('Invalid app name');

                // workspace/apps/storybook → workspace/apps/<safeName>
                const appDir = path.join(process.cwd(), '..', safeName);

                await fs.mkdir(appDir, { recursive: true });

                // If the folder already has a package.json (existing project),
                // skip writing package.json so we don't clobber it.
                const pkgPath = path.join(appDir, 'package.json');
                const alreadyExists = await fs.access(pkgPath).then(() => true).catch(() => false);

                for (const [filename, content] of Object.entries(files)) {
                  if (filename === 'package.json' && alreadyExists) continue;
                  await fs.writeFile(path.join(appDir, filename), content, 'utf-8');
                }

                res.end(JSON.stringify({ success: true, path: `apps/${safeName}` }));
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        },
      },
    ];

    return viteConfig;
  },
};

export default config;
