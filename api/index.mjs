export default async (req, res) => {
  try {
    const { default: app } = await import('../dist/index.cjs');
    return app(req, res);
  } catch (error) {
    console.error('Error loading app:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
