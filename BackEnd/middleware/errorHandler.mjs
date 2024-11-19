export default (err, req, res, next) => {
  console.error(err.stack); // מדפיס את השגיאה לקונסול
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
