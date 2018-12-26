var changba = require('./lib/changba.js')
var ls = require('./lib/localstorage.js')
var jsdom = require("jsdom")
var fs = require("fs")
var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8")

var artists = require('../artists')

var timeoutIndex = 0;
var artistIndex = 0
var artist = artists[artistIndex]
var localStorageFile 
var localStorage
var dataFile

fetchData(artistIndex)

function fetchData(artistIndex){
  if(artistIndex >= artists.length) {
    console.log('抓取完毕，下次见')
    return
  }
  artist = artists[artistIndex]
  dataFile = `./data/${artist.uid}.js`
  localStorageFile = `./localStorage/${artist.uid}.json`
  localStorage = ls.loadStorage(localStorageFile)
  timeoutIndex = 0
  console.log('开始抓取歌手：' + artist.uname)
  jsdom.env({
    url: `http://changba.com/u/${artist.uid}`,
    src: [jquery],
    done: function(err, window) {
        var $ = window.$
        var songs = []
        $('.userPage-work-li a').each(function() {
            var $this = $(this)
            songs.push({
                songname: this.firstChild.nodeValue.replace(/[\n\t]/g, ''),
                enworkid: $this.attr('href')
            })
        })
        var body = $('body').html()
        var match = /userid\s*=\s*'(\w+?)'/.exec(body)
        if(!match) {
          console.error(body)
          return
        } 
        
        var userid = match[1]

        changba.loadmore(userid, 1, function cb(pageNum, moreSongs) {
            songs = songs.concat(moreSongs)
            if (moreSongs.length == 0) {
                getSongsPath(songs)
            } else {
                changba.loadmore(userid, pageNum + 1, cb)
            }
        })
    }
  })
}

function getSongsPath(songs) {
    var promises = []
    songs.forEach((song, index) => {
        var cache = ls.get(localStorage, 'enworkid', song.enworkid)
        song = cache || song
        promises.push(getSongPath(song, index))
    })
    Promise.all(promises).then((songs) => {
        ls.saveStorage(localStorageFile, songs)
        console.log(`\n共计${songs.length}首`)
        fs.writeFileSync(dataFile, 'module.exports=' + JSON.stringify(songs), 'utf-8')
        console.log('8秒后抓取下一位歌手')
        setTimeout(() => {
          fetchData(++artistIndex)
        }, 8000)
    })
}

function getSongPath(song, index) {
    if (song.type) {
        return new Promise((resolve, reject) => {
            resolve(song)
            console.log(`${song.songname} done`)
        })
    } else {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                changba.fetch(song.enworkid, (err, data) => {
                    var src = /http:\/\/\w+\.changba\.com\/.*?\w+\.mp3/.exec(data)
                    if (src) {
                        song.src = src[0]
                        song.type = 'MP3'
                    } else {
                        song.src = `http://changba.com${song.enworkid}`
                        song.type = 'MV'
                    }
                    resolve(song)
                    console.log(`${song.songname} done`)
                })
            }, 2000 * timeoutIndex++)

        })
    }
}
