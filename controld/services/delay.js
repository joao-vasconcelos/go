module.exports = (miliseconds = 0) => {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
};
