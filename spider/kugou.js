var http = require('http')
var querystring = require('querystring')
var fs = require('fs')
var pagesize = 90
var op = {
    userid: -1,
    clientver: "",
    platform: "WebFilter",
    tag: "em",
    filter: 2,
    iscorrection: 1,
}

search(function(content){
  var lists = JSON.parse(content).data.lists
  var promises = lists.map((item, index) => {
    return new Promise((resolve,reject) => {
      setTimeout(() => {
        getPlayUrl(item.FileHash, (content) => {
          var obj = JSON.parse(content)
          console.log(`${obj.data.song_name} done`)
          resolve({
            songname: obj.data.song_name,
            src: obj.data.play_url
          })
        })
      }, index * 1000)
    })
  })
  Promise.all(promises).then((songs) => {
    console.log(`共计${songs.length}首`)
    fs.writeFileSync('./data/liangsheng.js', 'module.exports=' + JSON.stringify(songs), 'utf-8')
  })
})

function search(cb){
  var options = {
    protocol: 'http:',
    hostname: 'songsearch.kugou.com',
    port: 80,
    path: `/song_search_v2?keyword=亮声open&page=1&pagesize=${pagesize}`,
    method: 'GET'
  }
  var req = http.request(options, (res) => {
      res.setEncoding('utf8')
      var content = ''
      res.on('data', (chunk) => {
          content += chunk
      })
      res.on('end', () => {
          cb(content)
      })
  })

  req.on('error', (e) => {
      cb(e)
  })
  req.write(querystring.stringify(op))
  req.end()
}

function getPlayUrl(hash, cb){
  var options = {
    protocol: 'http:',
    hostname: 'wwwapi.kugou.com',
    port: 80,
    path: `/yy/index.php?r=play/getdata&hash=${hash}`,
    method: 'GET'
  }
  var req = http.request(options, (res) => {
      res.setEncoding('utf8')
      var content = ''
      res.on('data', (chunk) => {
          content += chunk
      })
      res.on('end', () => {
          cb(content)
      })
  })

  req.on('error', (e) => {
      cb(e)
  })
  req.end()
}
