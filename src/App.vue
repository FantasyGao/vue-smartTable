<template>
    <div id="index">
        <div class="myContent">
        <div class="searchItem">
          <div class="row">
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
              <div class="input-group">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">标题</button>
                </span>
                <input v-model="title" type="text" class="form-control" placeholder="Search for...">
              </div><!-- /input-group -->
            </div><!-- /.col-lg-6 -->
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
              <div class="input-group">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">类别</button>
                </span>
                <input v-model="classic" type="text" class="form-control" placeholder="Search for...">
              </div>
            </div>
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3">
              <div class="input-group">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="button">标签</button>
                </span>
                <input v-model="tag" type="text" class="form-control" placeholder="Search for...">
              </div>
            </div>
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
              <button class="searchBtn btn btn-info" @click = "search">查找</button>
            </div>
          </div>
        </div>
        <smartTable v-bind:get-message="tableData" v-on:receiveData="receiveData" ref="changeItem">
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
            <tr slot="tbody" v-for="item in Data">
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
import smartTable from './components/smartTable.vue'
export default {
  data () {
    return {
      tableData: {
        'method': 'GET',
        'type': 'async',
        'url': './static/json.json',
        'query': {}
      },
      Data: [],
      cityList: [
        {
          id: 1,
          value: '全部'
        },
        {
          id: 2,
          value: '已发表'
        },
        {
          id: 3,
          value: '撰写中'
        }
      ],
      status: 1,
      title: '',
      tag: '',
      classic: ''
    }
  },
  components: {
    smartTable
  },
  methods: {
    receiveData (data) {
      this.Data = data
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#index{
    background-color: #f5f5d5;
    font-family: Georgia, serif;
    letter-spacing: -0.01em;
    word-spacing: 0.2em;
    width: 100%;
    height:100%;
    padding-top: 30px;
}
.myContent{
    width:90%;
    margin-left:5%;
    background:white;
    padding:50px;
}
.searchItem{
    height:50px;
}
.searchBtn{
    width:100%;
}
</style>