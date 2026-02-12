export function errorHandler(err, req, res, next) {
  console.error(`Some error in ${req.path}`, err.message);
  res.status(500).json({ error: 'Internal Server Error' });
}