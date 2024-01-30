const {JSDOM} = require('jsdom')

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
  getURLsFromHTML
}