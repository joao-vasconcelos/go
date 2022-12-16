export default function delay(miliseconds = 0) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
