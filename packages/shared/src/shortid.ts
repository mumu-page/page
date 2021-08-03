export default function shortid(length: number = 5) {
  return Number(
    Math.random().toString().substr(3, length) + Date.now()
  ).toString(36)
}
