import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import pkg from './package.json' with { type: 'json' };

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Bannergress to UMM Downloader',
        icon: 'https://bannergress.com/favicons/favicon-96.png',
        namespace: 'matyifkbt/bannergress-to-umm-json',
        match: ['https://bannergress.com/banner/*'],
        version: `v${new Date().getTime()}`,
        downloadURL: `https://github.com/${pkg.author.name}/${pkg.name}/releases/download/latest/index.user.js`,
				updateURL: `https://github.com/${pkg.author.name}/${pkg.name}/releases/download/latest/index.meta.js`,
      },
    }),
  ],
});
