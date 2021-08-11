export function test(req, res, next) {
  console.log('inTest')
  res.status(200).json({ message: 'Okay' })
}
