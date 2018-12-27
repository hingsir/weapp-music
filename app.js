//app.js

var artists = require('./artists')

var artist = artists[0]

App({
  onLaunch: function () {
    
  },
  getUserInfo:function(cb){
    
  },
  globalData:{
    songList: require(`./data/${artist.uid}.js`),
    artist: artist.uname
  }
})
