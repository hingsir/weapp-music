var http = require('http')

module.exports = {
    fetch: function(path, callback) {
        var options = {
            hostname: 'changba.com',
            port: 80,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
            }
        }
console.log(path)
        var req = http.request(options, (res) => {
            res.setEncoding('utf8')
            var content = ''
            res.on('data', (chunk) => {
                content += chunk
            })
            res.on('end', () => {
                callback(null, content)
            })
        })

        req.on('error', (e) => {
            callback(e)
        })

        req.end()
    },
    loadmore: function(userid, curuserid, pageNum, callback) {
        this.fetch(`/member/personcenter/loadmore.php?ver=1&pageNum=${pageNum}&type=0&userid=${userid}&curuserid=${curuserid}`,
            (err, data) => {
                var songs = []
                JSON.parse(data).forEach((song) => {
                    songs.push({
                        songname: song.songname,
                        enworkid: '/s/' + song.enworkid
                    })
                })
                callback(pageNum, songs)
            }
        )
    }
}
