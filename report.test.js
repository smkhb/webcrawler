const {sortPages} = require('./report')
const {test, expect} = require('@jest/globals')

test('sortPages 2 pages', () => {
  const input = {
    'https://wagslane.dev/path': 1,
    'https://wagslane.dev': 3
  }
  const actual = sortPages(input)
  const expected = [
    ['https://wagslane.dev',3],
    ['https://wagslane.dev/path', 1],
  ]
  expect(actual).toEqual(expected)
})

test('sortPages 6 pages', () => {
  const input = {
    'https://wagslane.dev/path': 1,
    'https://wagslane.dev': 3,
    'https://wagslane.dev/path2': 2,
    'https://wagslane.dev/path3': 7,
    'https://wagslane.dev/path4': 4,
    'https://wagslane.dev/path5': 5,
  }
  const actual = sortPages(input)
  const expected = [
    ['https://wagslane.dev/path3', 7],
    ['https://wagslane.dev/path5',5],
    ['https://wagslane.dev/path4',4],
    ['https://wagslane.dev',3],
    ['https://wagslane.dev/path2', 2],
    ['https://wagslane.dev/path', 1],
  ]
  expect(actual).toEqual(expected)
})
