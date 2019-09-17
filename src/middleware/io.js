module.exports = io => (req, _, next) => {
  req.io = io;
  next();
};