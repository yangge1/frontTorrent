<template>
  <div class="list-view">
      <div class="header">
          <i-input on-click="" :value.sync="searchStr" search enter-button placeholder="Enter something..." />
      </div>
      <div class="body">
          <div v-for="torrent in torrents">
            <span class="name">{{torrent.name}}</span>
            <span class="hash">{{torrent.hash}}</span>
            <span class="length">{{torrent.size}}</span>
          </div>
      </div>
      <div class="footer">
          <Page :total="total" :page-size="pageSize" :current="current"></Page>
      </div>
  </div>
</template>
<script>
import fetch from '../server/api'
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
        this.total=await fetch.getCount({name:str});
        let torrents=await fetch.getTorrents({name:str,skip:0,limit:100});
        this.torrents=torrents;
      },
      async getList(skip,){
        let torrents=await fetch.getTorrents({name:this.searchStr,skip:0,limit:this.pageSize});
        this.torrents=torrents;
      }
  },
  mounted(){
    this.doSearch(this.searchStr)
  },
  beforeRouteEnter (to, from, next) {
      next(vm=>{
          vm.searchStr=to.params;
          
      })
  }
}
</script>

