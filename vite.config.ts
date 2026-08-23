import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import express from 'express';
import { handleApiRoutes } from './src/server/apiHandler';

function expressApiPlugin(): Plugin {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      server.middlewares.use(express.json());
      server.middlewares.use(express.urlencoded({ extended: true }));
      
      server.middlewares.use((req, res, next) => {
        // Injection sécurisée des méthodes Express
        res.status = function (statusCode: number) {
          this.statusCode = statusCode;
          return this;
        };

        res.json = function (body: any) {
          this.setHeader('Content-Type', 'application/json');
          this.end(JSON.stringify(body));
          return this;
        };

        res.send = function (body: any) {
          if (typeof body === 'object') {
            this.setHeader('Content-Type', 'application/json');
            this.end(JSON.stringify(body));
          } else {
            this.end(body);
          }
          return this;
        };

        handleApiRoutes(req as any, res as any, next);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), expressApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      allowedHosts: ['.ngrok-free.app'], // Autorise tous les tunnels ngrok automatiquement
    },
  };
});
