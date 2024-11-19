// config/logger.mjs
import chalk from "chalk";

// פונקציה לצביעת בקשות HTTP
export const colorizeMethod = (method) => {
  const colors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
  };
  return colors[method] ? colors[method](method) : chalk.white(method);
};
