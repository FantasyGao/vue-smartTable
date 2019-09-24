<template>
  <div id="index">
    <div class="content">
      <div class="search-item">
        <div class="col">
          <button class="btn" type="button">标题</button>
          <input v-model="title" type="text" placeholder="Search for...">
        </div>
        <div class="col">
          <button class="btn" type="button">类别</button>
          <input v-model="classic" type="text" placeholder="Search for...">
        </div>
        <div class="col">
          <button class="btn" type="button">标签</button>
          <input v-model="tag" type="text" placeholder="Search for...">
        </div>
        <div class="col">
          <button class="search-btn" @click = "search">查找</button>
        </div>
      </div>
      <smartTable v-bind:tableParam="tableParam" v-on:receiveData="receiveData" ref="changeItem">
        <tr slot="thead">
          <th>标题</th>
          <th>类别</th>
          <th>标签</th>
          <th>日期</th>
          <th>作者</th>
          <th>状态</th>
          <th>浏览量</th>
          <th>评论数</th>
          <th>操作</th>
        </tr>
        <tr slot="tbody" v-bind:key="item.id" v-for="item in tableData">
          <td>{{item.title}}</td>
          <td>{{item.classic}}</td>
          <td>{{item.tags}}</td>
          <td>{{item.time}}</td>
          <td>{{item.author}}</td>
          <td v-if="item.show ==1" class="btn-success btn-xs">已发表</td>
          <td v-if="item.show ==0" class="btn-info btn-xs">撰写中</td>
          <td>{{item.pv}}</td>
          <td>{{item.markNum}}</td>
          <td>
            <button class="btn btn-info btn-xs" @click = "toArticle(item.id,1)">预览</button>
            <button class="btn btn-info btn-xs" v-if="item.show ==0" @click = "toArticle(item.id,2)">撰写</button>
            <button v-if="item.show ==1" @click = "downLine(item.id,item.title)" class="btn btn-warning btn-xs">下线</button>
            <button v-if="item.show ==0" @click = "upLine(item.id,item.title)" class="btn btn-success btn-xs">上线</button>
            <button class="btn btn-danger btn-xs" @click = "deleteArticle(item.id,item.title)">删除</button>
          </td>
        </tr>
      </smartTable>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableParam: {
        method: 'GET',
        type: 'async',
        url: './mock/table.json',
        query: {},
        errCb: function(err) {
          console.log('数据获取异常', err);
        }
      },
      tableData: [],
      title: '',
      classic: '',
      tag: ''
    }
  },
  methods: {
    receiveData (data) {
      this.tableData = data
    },
    search () {
      let paramsObj = {}
      if (this.title) {
        paramsObj.title = this.title
      }
      if (this.status) {
        paramsObj.show = this.show
      }
      if (this.tag) {
        paramsObj.tag = this.tag
      }
      if (this.classic) {
        paramsObj.classic = this.classic
      }
      this.$refs.changeItem.fetchData(paramsObj)
    }
  },
  mounted () {
    if (document.body.clientHeight < window.innerHeight) {
      document.getElementById('index').style.height = window.innerHeight + 'px'
    }
  }
}
</script>

<style scoped>
#index {
  background-color: #f5f5d5;
  font-family: Georgia, serif;
  letter-spacing: -0.01em;
  word-spacing: 0.2em;
  width: 100%;
  height:100%;
  padding: 30px 0;
}
.content {
  width:90%;
  margin-left:5%;
  background:white;
  padding: 50px;
}
.search-item {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.search-item {
  height: 40px;
}
.search-item .btn {
  border: none;
  outline: none;
  border-radius: 4px;
  width: 60px;
  background: #e8e8e8;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
}

.search-item .col input {
  margin-left: 0;
  border: none;
  outline: none;
  border: 1px solid #666;
  border-radius: 4px;
  width: 200px;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
}

.search-btn {
  width: 200px;
  outline: none;
  background: #e8e8e8;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
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
  border: 1px solid transparent;
  border-radius: 4px;
}

</style>