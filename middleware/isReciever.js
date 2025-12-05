export const isReciever = (req, res, next) => {
  if (req.user.role !== 'receiver') {
    return res.status(403).json({ message: 'Access denied: Only receivers allowed' });
  }
  next();
};
