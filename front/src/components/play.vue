<template>
    <div class="play-class">
        <div class="view"></div>
        <div class="desc">
            <span>Adding {{torrentId}}</span>
            <span>Got torrent metadata! {{torrentId}}</span>
            <span>{{process}}</span>
        </div>
    </div>
</template>
<script>
import WebTorrent from 'webtorrent'
export default {
    name:'Play',
    data(){
        return {
            torrentId:null,
            process:''
        }
    },
    methods:{
        start(){
            var self=this;
        var client = new WebTorrent()

      client.on('error', function (err) {
        console.error('ERROR: ' + err.message)
      })

      var torrentId = self.torrentId;
        log('Adding ' + torrentId)
        client.add(torrentId, onTorrent)

      function onTorrent (torrent) {
          self.process='starting download data';

        // Print out progress every 5 seconds
        var interval = setInterval(function () {
            self.process='Progress: ' + (torrent.progress * 100).toFixed(1) + '%';
        }, 5000)

        torrent.on('done', function () {
          self.process='Progress: 100%';
          clearInterval(interval)
        })
        var file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4')
            })
            file.appendTo('.view')
        // Render all files into to the page
        torrent.files.forEach(function (file) {
          file.appendTo('.view')
          file.getBlobURL(function (err, url) {
            if (err) return log(err.message)
            log('File done.')
            log('<a href="' + url + '">Download full file: ' + file.name + '</a>')
          })
        })
      }
function log (str) {
        var p = document.createElement('p')
        p.innerHTML = str
        document.querySelector('.view').appendChild(p)
      }
        }
    },
    beforeRouteEnter (to, from, next) {
      if(from.name==='Tdetail'){
       return next(vm=>{
          vm.torrentId=to.query.torrentId;
          vm.start();
      })
      }
      next()
      
  }
}
</script>

