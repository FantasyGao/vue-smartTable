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

![smartTable](https://github.com/FantasyGao/vue-smartTable/blob/master/static/table.png)

### 配置项（父组件）
``` 
  tableData: {
    'method': 'GET',
    'type': 'async',
    'url': './static/json.json',
    'query': {}
  },
  Data: []
```

| 名称      | 类型 |  默认值 |  描述                          |
| ------------ | :-----: | :---------: | ---------------------------------------- |
| method        | String  |      GET       | http请求方式（GET/POST）  |
| type     | String  |     sync     | 数据请求方式（同步/异步）|
| url  | string |    ''     | 请求链接              |
| query  | object |   {}    | 添加参数            |

### 异步状态时，分页参数及查找参数字段
| 名称      | 类型 |  默认值 |  描述                          |
| ------------ | :-----: | :---------: | ---------------------------------------- |
| pageNum        | Numberg  |      10       | 每页展示 共pageNum条 数据 |
| page     | Number  |     1    | 展示第page页数据|
| searchKey | String |    ''     | 全局搜索字段                 |

### 后端数据返回格式
| 名称      | 类型 | 默认值 | 描述                          |
| ------------ | :-----: | :---------: | ---------------------------------------- |
| method        | number  |             | 返回状态值 |
| msg     | String  |          | 返回信息|
| data  | object |         | 返回具体数据对象              |
| count  | number |      | 返回所有总数          |
| list  | array |      | 返回具体数据          |
```json
{
	"status":1,
	"msg":"查询成功",
	"data":{
		"count":3, 
		"list":[
			{ 
			"id": 1,
			"title": "ceshititle"
		       },
		       { 
		       "id": 2,
		       "title": "ceshititle"
		       }
     ]
  }
}
```

### 演示（具体可看文件）
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
      this.$refs.changeItem.fetchData(paramsObj)
    }
  }
}
</script>
```
