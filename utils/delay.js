export default function delay(miliseconds = 500) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
