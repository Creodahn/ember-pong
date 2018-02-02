export default function padScore(score) {
  return `${score > 9 ? score : `0${score}`}`;
}
