var app = getApp()

var artists = require('../../artists')
var modes = ['loop', 'random', 'single']
make_looper(modes)

Page({
  data: {
    artistIndex: 3,
    displayList: [],
    src: null,
    name: null,
    author: '寒江雪',
    time: '',
    poster: '../../images/hanjiangxue.jpg',
    status: 'play',
    mode: 'loop',
    audioAction: {
      method: 'pause'
    },
    artist: null,
    loading: true
  },
  onShareAppMessage: function () {
    return {
      title: '笛曲-唱吧寒江雪',
      desc: '幽幽笛声仿若天籁',
      path: '/pages/index/index'
    }
  },
  binderror: function(){
    console.error(`${this.data.name}(${this.data.src})播放错误`)
    this.next()
  },
  started: function(){
    console.log(`开始播放：${this.data.src}`)
    this.setData({
      loading: false
    })
  },
  ended: function(){
    this.next()
  },
  timeupdate: function(e){
    var currentTime = e.detail.currentTime
    var duration = e.detail.duration
    this.setData({
      time: formatTime(duration - currentTime),
      loading: false
    })
  },
  playItem: function(e){
    if(this.data.mode === 'single'){
      this.setMode('random')
    }
    var song = this.data.playList.current(e.currentTarget.dataset.src)
    this.setData({
      src: song.src,
      name: song.songname,
    })
    this.play()
  },
  play_pause: function () {
    if(this.data.status == 'play'){
      this.play()
      this.setData({
        status: 'pause'
      })
    } else {
      this.pause()
      this.setData({
        status: 'play'
      })
    }
  },
  next: function(e){
    if(e){
      if (this.data.mode === 'single') {
        this.setMode('random')
      }
    }
    
    var song = this.data.playList.next()
    this.setData({
      src: song.src,
      name: song.songname,
    })
    this.play()
  },
  prev: function(){
    if(this.data.mode === 'single'){
      this.setMode('random')
    }
    var song = this.data.playList.prev()
    this.setData({
      src: song.src,
      name: song.songname,
    })
    this.play()
  },
  play: function(){
    this.setData({
      status: 'pause',
      audioAction: {
        method: 'play'
      },
      loading: true
    })
  },
  pause: function(){
    this.setData({
      status: 'play',
      audioAction: {
        method: 'pause'
      },
    })
  },
  switchMode: function(){
    var mode = modes.next()
    this.setMode(mode)
    this.play()
  },
  setMode: function(mode){
    var playList = this.data.playList
    if(mode === 'loop'){
      playList = this.data.displayList.slice(0)
    }else if(mode === 'random'){
      playList = this.data.displayList.slice(0).sort(function(){
        return Math.random() > 0.5 ? 1 : -1
      })
    }else if(mode === 'single'){
      playList = [playList.current(this.data.src)]
    }
    make_looper(playList, setCurrent)
    this.setData({
      mode: mode,
      playList
    })
  },
  switchArtist: function(e){
    var artistIndex = e.detail.value
    var artist = artists[artistIndex]
    this.setData({
      artistIndex,
      artist: artist
    })
    this.setArtist(artist)
    this.play()
  },
  setArtist: function (artist){
    wx.setNavigationBarTitle({
      title: artist.uname,
    })

    var songList = require(`../../data/${artist.uid}.js`)

    var displayList = songList.filter(function (item) {
      return item.type !== 'MV'
    })
    var playList = displayList.slice(0)
    make_looper(playList, setCurrent)

    this.setData({
      src: playList[0].src,
      name: playList[0].songname,
      artists,
      artist,
      playList,
      displayList
    })
  },
  onLoad: function () {
    var artist = artists[this.data.artistIndex]

    this.setArtist(artist)  
  }
})

function setCurrent(src){
  var idx = 0
  this.forEach(function(item, index){
    if(src === item.src){
      return idx = index
    }
  })
  return idx
}

function make_looper(arr, setCurrent){

    arr.loop_idx = 0

    arr.current = function(current){
      if(current){
        this.loop_idx = setCurrent.call(this, current)
      }
      if( this.loop_idx < 0 ){
        this.loop_idx = this.length - 1
      }
      if( this.loop_idx >= this.length ){
        this.loop_idx = 0
      }
      return arr[ this.loop_idx ]
    }

    arr.next = function(){
      this.loop_idx++
      return this.current()
    }

    arr.prev = function(){
      this.loop_idx--
      return this.current()
    }
}

function formatTime(seconds){
  var min = ~~(seconds / 60)
  var sec = parseInt(seconds - min * 60)
  return min + ':' + ('00' + sec).substr(-2)
}
