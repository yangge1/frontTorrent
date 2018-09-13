<template>
  <div class="index-view">
    <div class="pos-bg"><img src="../assets/index.jpg" alt="" width="100%" height="100%"></div>
    <div class="pos-search">
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <el-input placeholder="请输入内容"  v-model="searchStr" class="input-with-select">
            <el-button @click="doSearch(searchStr)" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </div>
  </div>
</template>
<script>
  export default {

    name: 'Index',
    data() {
      return {
        torrents: [],
        count: 0,
        searchStr: ''
      }
    },
    methods: {
      doSearch(str) {
        console.log(1111111111111)
        this.$router.push({
          path: 'tlist',
          query: {
            search: this.searchStr
          }
        })
      }
    }
  }

</script>
< !-- Add "scoped" attribute to limit CSS to this component only -->
  <style lang='less' scoped>
    .index-view {
      height: 100%;

      .pos-bg {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0px;
        top: 0px;
      }

      .pos-search {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;

        .el-container {
          height: 100%;
        }

        .el-main {
          height: calc(~"100% - 60px");

        }

      }
    }

  </style>
  <style lang="css" scoped>
    .el-input-group {
      position: absolute;
      width: calc(~"100% - 42px");
      top: 50%;
      height: 50px;
      margin-top: -30px;
    }
.el-input-group__append{
      background: #37803c33;
}
    .el-input__inner {
      background: #37803c66;
      height: 50px;
    }

  </style>
