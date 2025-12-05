export const isDonor = (req, res, next) => {
  if (req.user.role !== 'donor') {
    return res.status(403).json({ message: 'Access denied: Only donors allowed' });
  }
  next();
};
