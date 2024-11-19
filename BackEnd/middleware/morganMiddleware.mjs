import morgan from "morgan";
import chalk from "chalk";

// פונקציה לצביעת סוג הבקשה (GET, POST וכו')
const colorizeMethod = (method) => {
  const colors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
  };
  return colors[method] ? colors[method](method) : chalk.white(method);
};

// פונקציה לצביעת זמן תגובה
const colorizeResponseTime = (responseTime) => {
  const time = parseFloat(responseTime); // המרת זמן התגובה למספר
  return time > 5000
    ? chalk.red(`${responseTime} ms`)
    : chalk.green(`${responseTime} ms`);
};

// Middleware מותאם אישית של Morgan
const morganMiddleware = morgan((tokens, req, res) => {
  const method = colorizeMethod(tokens.method(req, res)); // צביעת סוג הבקשה
  const url = tokens.url(req, res); // URL הבקשה
  const status = tokens.status(req, res); // סטטוס התגובה
  const responseTime = tokens["response-time"](req, res); // זמן תגובה
  const coloredResponseTime = colorizeResponseTime(responseTime); // צביעת זמן תגובה

  // יצירת תאריך ושעה בפורמט ברור
  const now = new Date();
  const date = `${now.toLocaleDateString("en-GB")}`; // תאריך (DD/MM/YYYY)
  const time = `${now.toLocaleTimeString("en-GB")}`; // שעה (HH:MM:SS)

  return `[${date} ${time}] ${method} ${url} - Status: ${status}, Response Time: ${coloredResponseTime}`;
});

export default morganMiddleware;
