# vue-smartTable

> 基于vue2.js的智能表格插件

### Getting Start

```
> git clone https://github.com/FantasyGao/vue-smartTable.git
> cd vue-smartTable
> npm install 
> npm run dev
```

### 效果图

[smartTable](https://github.com/FantasyGao/vue-smartTable/blob/master/static/table.png)

#### 配置项（父组件）
``` 
  tableData: {
    'method': 'GET',
    'type': 'async',
    'url': './static/json.json',
    'query': {}
  },
  Data: []
```
method： 请求方式，可选POST、GET(默认GET)
type: 获取方式,可选async，sync（默认sync同步）
url：请求链接
query：自带参数


### 使用方法
``` vue
<smartTable v-bind:get-message="tableData" v-on:receiveData="receiveData" ref="changeItem">
    <tr slot="thead">
      <th>标题</th>
      <th>类别</th>
      <th>操作</th>
    </tr>
    <tr slot="tbody" v-for="item in Data">
      <td>{{item.title}}</td>
      <td>{{item.classic}}</td>
      <td>
        <button class="btn btn-info btn-xs" @click = "toArticle(item.id,1)">预览</button>
        <button class="btn btn-danger btn-xs" @click = "deleteArticle(item.id,item.title)">删除</button>
      </td>
    </tr>
</smartTable>
```
javascript
``` javascript
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
      Data: []
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
  }
}
</script>
```
