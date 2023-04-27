export default function delay(miliseconds = 3000) {
  return new Promise((resolve) => setTimeout(resolve, miliseconds));
}
