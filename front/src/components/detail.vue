<template>
  <div class="detail-view">
    <h3>{{torrent.name}}</h3>
    <div class="magnet-link">{{torrent.magnet}}</div>
    <div class="text-center pt-20">
      <a :href="'http://btcache.me/torrent/'+torrent.hash" class="btn btn-lg btn-primary ptb-20" target="_blank">Download
        Torrent<br>{{torrent.name}}</a>
    </div>
    <div class="detail data-list">
      <div class="row">
        <div class="col-md-2 col-sm-3 field">Torrent Hash:</div>
        <div class="col-md-10 col-sm-9 value hash">{{torrent.hash}}</div>
      </div>
      <div class="row">
        <div class="col-md-2 col-sm-3 field">Number of Files:</div>
        <div class="col-md-10 col-sm-9 value">{{torrent.num}}</div>
      </div>
      <div class="row">
        <div class="col-md-2 col-sm-3 field">Content Size:</div>
        <div class="col-md-10 col-sm-9 value">{{torrent.size}}</div>
      </div>
      <div class="row">
        <div class="col-md-2 col-sm-3 field">Convert On:</div>
        <div class="col-md-10 col-sm-9 value">{{torrent.createDate}}</div>
      </div>
      <div class="detail data-list" style="margin-bottom:10px;">
        <div class="row file-r">
          <div class="file-name address" style="font-weight:bold">Address</div>
          <div class="file-path port" style="font-weight:bold">Port</div>
        </div>
        <div v-if="torrent.wires&&torrent.wires[0]">
          <div v-for="wire in torrent.wires" class="row file-r">
          <div class="file-name address">
            {{wire.address}}</div>
          <div class="file-path port">{{wire.port}}</div>
        </div>
        </div>
        
      </div>
      <div class="row">
        <div class="col-md-2 col-sm-3 field">Keywords:</div>
        <div class="col-md-10 col-sm-9 value tags-box">
          <a class="tag t8" v-for="keyword in keywords" :href="'https://btso.pw/search/'+keyword">{{keyword}} </a>
            </div> </div> <div class="row visible-xs-block">
            <div class="col-md-2 col-sm-3 field">Magnet Link:</div>
            <div class="col-md-10 col-sm-9 value"><textarea class="magnet-link" readonly="" v-model="torrent.magnet"></textarea></div>
        </div>
      </div>
      
      <div class="detail data-list">
        <div class="row file-r">
          <div class="file-name" style="font-weight:bold">File Name</div>
          <div class="file-path" style="font-weight:bold">File Path</div>
          <div class="file-size" style="font-weight:bold">Size</div>
        </div>
        <div @click="toPlay(torrent.hash)">view all</div>
        <div v-for="file in torrent.files" class="row file-r">
          <div class="file-name"><span class="glyphicon" :class="{'glyphicon-film':isVideo(file.name),'glyphicon-picture':isPictrue(file.name),
          'glyphicon-music':isAudio(file.name),'glyphicon-file':isOther(file.name)}"></span>
            {{file.name}}</div>
          <div class="file-path">{{file.path}}</div>
          <div class="file-size">{{parseUnit(file.size)}}</div>
          <div class="col-xs-12 field" v-if="isVideo(file.name)"><a href="https://btso.pw/video/plib_adriana_chechik_vl060118_720p_2600" class="btn btn-warning"><span
                class="glyphicon glyphicon-play"></span> Play Now</a></div>
        </div>
      </div>
    </div>
</template>
<script>
  import {getCount,getTorrentDetail} from '../server/api'
  import util from '../util'
  export default {
    data(){
      return {
        torrent:{
          
        },
        keywords:[],
        hash:''
      }
    },
    mounted(){
    this.getDetailByHash(this.$route.query.hash)
  },
  computed:{
    
  },
  methods:{
    async getDetailByHash(hash){
      let torrent=await getTorrentDetail({hash:hash});
      this.torrent=torrent[0]
      console.log(this.torrent);
      this.keywords=this.getKeywords(this.torrent.magnet);
      console.log(this.keywords);
    },
    toPlay(hash){
          this.$router.push({
          path: 'play',
          query: {
            torrentId: hash
          }
        })
    },
    isVideo(file){
      return /\.(mp4|wav|avi|mov|3gp|flv|rmvb|mkv)/i.test(file);
    },
    isAudio(file){
      return /\.(mp3|wma|aac|flac|MIDI|CD|WAVE|AIFF|APE|AMR|RealAudio|MIDI)/i.test(file);
    },
    isPictrue(file){
      return /\.(bmp|jpg|png|tif|gif|svg|psd|ai|webp|raw)/i.test(file);
    },
    isOther(file){
      return !this.isVideo(file)&&!this.isAudio(file)&&!this.isPictrue(file);
    },
    parseUnit:util.parseUnit,
    getKeywords(magnet){
      let reg=/(.+)&dn=(.+)&?/gi;
      let str=magnet.replace(reg,'$2');
      let keyArr=str.split(/\.|\_/)
      return keyArr;
    }
  },
    beforeRouteEnter (to, from, next) {
      if(from.name==='Tlist'){
       return next(vm=>{
          vm.hash=to.query.hash;
          
      })
      }
      next()
      
  }
  }

</script>
<style lang="less" scoped>
  .detail-view {
    padding: 0px 80px;
    overflow: auto;
    height: 100%;
    background-color: #f6f2e6;

    .glyphicon {
      position: relative;
      top: 1px;
      display: inline-block;
      font-family: 'Glyphicons Halflings';
      -webkit-font-smoothing: antialiased;
      font-style: normal;
      font-weight: normal;
      line-height: 1;
      -moz-osx-font-smoothing: grayscale;
    }

    .file-r {
      font-size: 0px;
    }

    .file-name {
      width: 60%;
      display: inline-block;
      font-size: 16px;
      &.address{
        width:90%;
      }
    }

    .file-path {
      width: 30%;
      display: inline-block;
      font-size: 16px;
      &.port{
        width:10%;
      }
    }

    .file-size {
      width: 10%;
      display: inline-block;
      font-size: 16px;
    }

    .btn-group-vertical>.btn-group:after,
    .btn-group-vertical>.btn-group:before,
    .btn-toolbar:after,
    .btn-toolbar:before,
    .clearfix:after,
    .clearfix:before,
    .container-fluid:after,
    .container-fluid:before,
    .container:after,
    .container:before,
    .dl-horizontal dd:after,
    .dl-horizontal dd:before,
    .form-horizontal .form-group:after,
    .form-horizontal .form-group:before,
    .modal-footer:after,
    .modal-footer:before,
    .modal-header:after,
    .modal-header:before,
    .nav:after,
    .nav:before,
    .navbar-collapse:after,
    .navbar-collapse:before,
    .navbar-header:after,
    .navbar-header:before,
    .navbar:after,
    .navbar:before,
    .pager:after,
    .pager:before,
    .panel-body:after,
    .panel-body:before,
    .row:after,
    .row:before {
      display: table;
      content: " ";
    }

    .detail-link,
    .magnet-link {
      overflow: hidden;
      vertical-align: top;
      resize: vertical;
      cursor: text;
      border: 1px solid #ddcea2;
      background: #ece4cc;
      width: 100%;
      padding: 10px;
      text-align: left;
      border-radius: 5px;
    }

    .pt-20,
    .ptb-20 {
      padding-top: 20px;
    }

    .text-center {
      text-align: center;
    }

    .data-list .row {
      padding: 5px 0;
      border-bottom: 1px solid #ece4cc;
    }

    .data-list .field {
      margin: 5px 0;
      font-weight: 700;
    }

    .data-list .value {
      margin: 5px 0;
    }

    .row {
      margin-right: -15px;
      margin-left: -15px;
    }

    .glyphicon {
      position: relative;
      top: 1px;
      display: inline-block;
      font-family: Glyphicons Halflings;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .data-list a.btn,
    .data-list a.btn:hover {
      color: #fff;
    }

    .data-list a {
      color: #333;
      text-decoration: none;
    }

    .btn-primary {
      background-image: -webkit-linear-gradient(top, #337ab7, #265a88);
      background-image: -webkit-gradient(linear, left top, left bottom, from(#337ab7), to(#265a88));
      background-image: linear-gradient(180deg, #337ab7 0, #265a88);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ff337ab7', endColorstr='#ff265a88', GradientType=0);
      filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
      background-repeat: repeat-x;
      border-color: #245580;
    }

    .btn-danger,
    .btn-default,
    .btn-info,
    .btn-primary,
    .btn-success,
    .btn-warning {
      text-shadow: 0 -1px 0 rgba(0, 0, 0, .2);
      box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, .15), 0 1px 1px rgba(0, 0, 0, .075);
    }

    .btn-group-lg>.btn,
    .btn-lg {
      padding: 10px 16px;
      font-size: 18px;
      line-height: 1.3333333;
      border-radius: 6px;
    }

    .btn-primary {
      color: #fff;
      background-color: #337ab7;
      border-color: #2e6da4;
    }

    .btn {
      display: inline-block;
      padding: 6px 12px;
      margin-bottom: 0;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      background-image: none;
      border: 1px solid rgba(0, 0, 0, 0);
      border-radius: 4px;
    }

    a {
      color: #337ab7;
      text-decoration: none;
    }

    .magnet-link {
      overflow: hidden;
      vertical-align: top;
      resize: vertical;
      cursor: text;
      border: 1px solid #ddcea2;
      background: #ece4cc;
      width: 100%;
      padding: 10px;
      text-align: left;
      height: 8em;
      border-radius: 5px;
    }

    .btn-warning {
      background-image: -webkit-linear-gradient(top, #f0ad4e, #eb9316);
      background-image: -webkit-gradient(linear, left top, left bottom, from(#f0ad4e), to(#eb9316));
      background-image: linear-gradient(180deg, #f0ad4e 0, #eb9316);
      filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fff0ad4e', endColorstr='#ffeb9316', GradientType=0);
      filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);
      background-repeat: repeat-x;
      border-color: #e38d13;
    }

    .data-list .row {
      padding: 5px 0;
      border-bottom: 1px solid #ece4cc;
    }

    .btn-group-vertical>.btn-group:after,
    .btn-toolbar:after,
    .clearfix:after,
    .container-fluid:after,
    .container:after,
    .dl-horizontal dd:after,
    .form-horizontal .form-group:after,
    .modal-footer:after,
    .modal-header:after,
    .nav:after,
    .navbar-collapse:after,
    .navbar-header:after,
    .navbar:after,
    .pager:after,
    .panel-body:after,
    .row:after {
      clear: both;
    }

    *,
    :after,
    :before {
      box-sizing: border-box;
    }

  }

</style>
<style>
  html,
  body {
    margin: 0px;
  }
@font-face {
      font-family: 'Glyphicons Halflings';
      src: url('../fonts/glyphicons-halflings-regular.eot');
      src: url('../fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'), url('../fonts/glyphicons-halflings-regular.woff') format('woff'), url('../fonts/glyphicons-halflings-regular.ttf') format('truetype'), url('../fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg');
    }
</style>
