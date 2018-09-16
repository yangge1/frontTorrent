<template>
  <div class="list-view">
      <div class="header">
          <el-input placeholder="请输入内容"  v-model="torrent.searchStr" @keyup.enter.native="doSearch(torrent.searchStr)" class="input-with-select">
            <el-button @click="doSearch(torrent.searchStr)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        
      </div>
      <div class="head-title">
          <span class="name">display Name</span>
            <span class="hash">infohash</span>
            <span class="length">size</span>
      </div>
      <div class="body">
          <div v-for="tor in torrent.torrents" class="list-item" @click="toDetil(tor.hash)">

            <span class="name" v-html="lihightStr(tor.name,torrent.searchStr)"></span>
            <span class="hash">{{tor.hash}}</span>
            <span class="length">{{tor.size}}</span>
          </div>
      </div>
      <div class="footer">
          <el-pagination layout="prev, pager, next" :page-size="page.pageSize" :total="page.total" @current-change="currentPageChage">
        </el-pagination>
         
      </div>
  </div>
</template>
<script>
import {getCount,getTorrents} from '../server/api'
export default {
  data(){
      return {
          torrent:{
              torrents:[],
              searchStr:'',
              limit:100
          },
          
          page:{
              pageSize:100,
              total:null,
              current:0,
          }
          
          
      }
  },
  methods:{
      async doSearch(str){
        let countData=await getCount({filter:str});
        this.page.total=countData;
        let torrents=await getTorrents({filter:str,skip:1,limit:this.torrent.limit});
        this.torrent.torrents=torrents;
      },
      currentPageChage(curPage){
         this.getList(curPage)
      },
      lihightStr(name,htmlStr){
        if(!name) return '';
        if(!htmlStr) return name;
        let strSearch=htmlStr.replace('\\','\\\\').replace('\/','\\\/');
        let str=name.replace(new RegExp(`(${strSearch})`,'i'),"<span style=\'color:#f00\'>$1</span>");
        return str;
      },
      toDetil(hash){
          this.$router.push({
          path: 'tdetail',
          query: {
            hash: hash
          }
        })
      },
      async getList(skip){
        this.torrent.torrents=await getTorrents({filter:this.torrent.searchStr,skip:skip,limit:this.torrent.limit});
      }
  },
  mounted(){
    this.doSearch(this.torrent.searchStr)
  },
  beforeRouteEnter (to, from, next) {
      if(from.name==='Index'){
       return next(vm=>{
          vm.torrent.searchStr=to.query.searchStr;
          
      })
      }
      next()
      
  }
}
</script>
<style lang="less">
   .list-view{
       height: 100%;
       
    .head-title{
        height: 30px;
            line-height: 30px;
    font-weight: bold;
        .name,.hash,.size{
                   display: inline-block;
                   
                   
               }
        .name{
                   width: 60%;
               }
               .hash{
                   width: 30%;
               }
               .size{
                   width:10%;
               }
    }
       .body{
           height: calc(~"100% - 140px");
           margin-top: 10px;
           overflow: auto;
           .list-item{
               &:hover{
                   color: #3eaf7c;
                   cursor: pointer;
               }
               min-height: 30px;
               margin-bottom: 10px;
               &:nth-child(2n){
background: #eee;
               }
               .name{
                   width: 60%;
               }
               .hash{
                   width: 30%;
               }
               .size{
                   width:10%;
               }
               .name,.hash,.size{
                   display: inline-block;
                   
                   
               }
               .name{
                   
               }
           }
    }
   } 
    
</style>


