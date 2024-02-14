const {JSDOM} = require('jsdom')

async function crawlPage(baseURL,currentURL, pages){

  const baseURLObj = new URL(baseURL)
  const currentURLObj = new URL(currentURL)

  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages
  }

  const normalizedURL = normalizeURL(currentURL)

  if(pages[normalizedURL] > 0){
    pages[normalizedURL]++
    return pages
  }

  pages[normalizedURL] = 1

  console.log(`Actively crawling: ${currentURL}`)

  try{
    const resp = await fetch(currentURL)

    if(resp.status > 399){
      console.log(`error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
      return pages
    }

    const contentType = resp.headers.get('content-type')
    if(!contentType.includes('text/html')){
      console.log(`non html response, content type: ${contentType}, on page: ${currentURL}`)
      return pages
    }


    const htmlBody = await resp.text()
    
    const nextURLs = getURLsFromHTML(htmlBody,baseURL)

    for( const nextURL of nextURLs){
      pages = await crawlPage(baseURL,nextURL,pages)
    }

  } catch (err){
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
  }
  return pages

}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = []
  const dom = new JSDOM(htmlBody)
  const linksElements = dom.window.document.querySelectorAll('a')
  
  for (const linkElement of linksElements){
    if(linkElement.href.slice(0,1) === '/'){
      //relative

      try{
        const urlObj = new URL(`${baseURL}${linkElement.href}`)
        urls.push(urlObj.href)
      } catch(err){
        console.log(`Error with relative URL: ${err.message}`)
      }

    } else{
      //absolute

      try{
        const urlObj = new URL(`${linkElement.href}`)
        urls.push(urlObj.href)
      } catch(err){
        console.log(`Error with absolute URL: ${err.message}`)
      }
    }
  }
  return urls
}

function normalizeURL(url){
  const urlObj = new URL(url)
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`

  if(hostPath.length > 0 && hostPath.slice(-1) == '/'){
    return hostPath.slice(0,-1)
  }
  return hostPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}