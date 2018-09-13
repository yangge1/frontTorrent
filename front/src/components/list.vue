<template>
  <div class="list-view">
      <div class="header">
          <el-input placeholder="请输入内容"  v-model="searchStr" class="input-with-select">
            <el-button @click="doSearch(searchStr)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        
      </div>
      <div class="body">
          <div v-for="torrent in torrents">
            <span class="name">{{torrent.name}}</span>
            <span class="hash">{{torrent.hash}}</span>
            <span class="length">{{torrent.size}}</span>
          </div>
      </div>
      <div class="footer">
          <el-pagination
    layout="prev, pager, next"
    :current-page.sync="current"
    :total="total">
  </el-pagination>
      </div>
  </div>
</template>
<script>
import {getCount,getTorrents} from '../server/api'
export default {
  data(){
      return {
          torrents:[],
          total:0,
          pageSize:20,
          current:0,
          searchStr:''
      }
  },
  methods:{
      async doSearch(str){
        this.total=await getCount({name:str});
        let torrents=await getTorrents({name:str,skip:0,limit:100});
        this.torrents=torrents;
      },
      async getList(skip,){
        let torrents=await getTorrents({name:this.searchStr,skip:0,limit:this.pageSize});
        this.torrents=torrents;
      }
  },
  mounted(){
    this.doSearch(this.searchStr)
  },
  beforeRouteEnter (to, from, next) {
      if(from.name==='Index'){
       return next(vm=>{
          vm.searchStr=to.query.searchStr;
          
      })
      }
      next()
      
  }
}
</script>

