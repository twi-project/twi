/**
 * Run Promise sequence in series
 *
 * @param {Array<Promise<any>>} iterable
 * @param {any[]} ...args
 */
// DEPRECATED
function runSeries(iterable, ...args) {
  const step = (prev, next) => Promise.resolve(prev).then(() => next(...args))

  if (iterable.length <= 1) {
    return step(null, iterable[0])
  }

  return iterable.reduce(step, null)
}

export default runSeries