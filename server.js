import('./dist/index.cjs').then(module => {
  const app = module.default || module;
  if (typeof app === 'function') {
    app();
  }
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
