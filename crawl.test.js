const {normalizeURL, getURLsFromHTML} = require('./crawl')
const {test, expect} = require('@jest/globals')

test('normalizeURL strip protocol', () => {
  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL trailing slashes', () => {
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL no capitals', () => {
  const input = 'https://Blog.Boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
  const input = 'http://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('getURLsFromHTM absolute', () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://blog.boot.dev">
        Boot.dev Blog
      </a>
    </body>
  </html>
  `
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expected = ['https://blog.boot.dev/']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTM relative', () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path/">
        Boot.dev Blog Relative
      </a>
    </body>
  </html>
  `
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expected = ['https://blog.boot.dev/path/']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTM both', () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path/">
        Boot.dev Blog Relative
      </a>
      <a href="https://blog.boot.dev">
        Boot.dev Blog
     </a>
    </body>
  </html>
  `
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expected = ['https://blog.boot.dev/path/','https://blog.boot.dev/']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTM invalid', () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="invalid">
        invalid
      </a>
    </body>
  </html>
  `
  const inputBaseURL = 'https://blog.boot.dev'
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
  const expected = []
  expect(actual).toEqual(expected)
})