<template>
  <div class="smartTable">
    <div class="header">
      <div class="select">
        <span>每页展示</span>
        <select v-model="selectedPageNum" v-on:change="chooosePageNum(selectedPageNum)">
          <option v-bind:key="pageNum.num" v-for="pageNum in pageNumList" v-bind:value="pageNum.num">{{pageNum.num}}</option>
        </select>
        <span>条</span>
      </div>
      <div class="search">
        <input type="text" v-model="searchKey"  placeholder="输入查找">
      </div>
    </div>
    <div>
      <table class="table">
        <thead>
            <slot name="thead"></slot>
        </thead>
        <tbody>
            <slot name="tbody"></slot>
        </tbody>
      </table>
    </div>
    <div class="footer">
      <div class="count">
        <span>共计</span>{{total}}<span>条</span>
      </div>
      <div class="pagination">
        <ul>
          <li class="disabled firstPage"  v-if="disabled[0]">首页</li>
          <li class="disabled"  v-if="disabled[0]">上一页</li>
          <li class="firstPage" @click="chooosePage(1)" v-if="!disabled[0]">首页</li>
          <li @click="chooosePage(currentPage-1)" v-if="!disabled[0]">上一页</li>
          <li v-if="showToggle[0]">...</li>
          <li v-bind:key="page.num" v-for="page in pageList" v-bind:class="{ 'active':page.clicked }">
            <span @click="chooosePage(page.num)">{{page.num}}</span>
          </li>
          <li v-if="showToggle[1]">...</li>
          <li @click="chooosePage(currentPage+1)" v-if="disabled[1]">下一页</li>
          <li class="lastPage" @click="chooosePage(maxPage)" v-if="disabled[1]">末页</li>
          <li class="disabled" v-if="!disabled[1]">下一页</li>
          <li class="disabled lastPage" v-if="!disabled[1]">末页</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'SmartTable',
  data () {
    return {
      total: 0,
      searchKey: '',
      disabled: [],
      showToggle: [],
      pageNumList: [
        {num: 10},
        {num: 20},
        {num: 50}
      ],
      selectedPageNum: 10,
      pageList: [],
      currentPage: 1,
      maxPage: 0,
      resultData: [],
      initData: [],
      query: {}
    }
  },
  props: ['tableParam'],
  methods: {
    // 向父组件发送数据
    sendData (data) {
      this.$emit('receiveData', data)
    },
    // 选择页码
    chooosePage (currentPage) {
      this.currentPage = currentPage
      if (this.tableParam.type === 'async') {
        this.fetchData()
      } else {
        this.grocessData()
      }
    },
    // 选择分页大小
    chooosePageNum (currentPageNum) {
      this.currentPage = 1
      if (this.tableParam.type === 'async') {
        this.fetchData()
      } else {
        this.processData()
      }
    },
    doPagination (currentPage) {
      this.currentPage = currentPage
      // 判断左右翻页是否可用
      if (this.maxPage !== 1) {
        if (currentPage === 1) {
          this.disabled = [true, true]
        } else if (currentPage === this.maxPage) {
          this.disabled = [false, false]
        } else {
          this.disabled = [false, true]
        }
      } else {
        this.disabled = [true, false]
      }
      // 根据最大值页码判断页尾展示
      if (this.maxPage > 7) {
        if (currentPage <= 4) {
          this.showToggle = [false, true]
          this.pageList = this.printPageList(6, currentPage - 1, 1)
        } else if (currentPage > this.maxPage - 4) {
          this.showToggle = [true, false]
          this.pageList = this.printPageList(6, currentPage - this.maxPage + 5, this.maxPage - 5)
        } else {
          this.showToggle = [true, true]
          this.pageList = this.printPageList(5, 2, currentPage - 2)
        }
      } else {
        this.showToggle = [false, false]
        this.pageList = this.printPageList(this.maxPage, currentPage - 1, 1)
      }
    },
    // 生产页码
    printPageList (x, y, z) {
      let List = []
      for (let i = 0; i < x; i++) {
        List[i] = {}
        List[i]['num'] = i + z
        if (i === y) {
          List[i]['clicked'] = true
        } else {
          List[i]['clicked'] = false
        }
      }
      return List
    },
    processData () {
      if (this.total % this.selectedPageNum > 0) {
        this.maxPage = Math.ceil(this.total / this.selectedPageNum)
      } else {
        this.maxPage = this.total / this.selectedPageNum
      }
      this.doPagination(this.currentPage)
      // 默认同步方式发送数据
      if (this.tableParam.type === 'async') {
        this.sendData(this.resultData)     // 发送数据
      } else {
        let page = this.currentPage - 1
        this.sendData(this.resultData.slice(page * this.selectedPageNum, this.selectedPageNum * this.currentPage))
      }
    },
    // 查询信息
    fetchData (paramsObj) {
      if (paramsObj) {
        this.currentPage = 1
        this.query = paramsObj
      }
      if (this.tableParam.query) {
        this.query = this.tableParam.query
      }
      // 默认同步
      if (this.tableParam.type === 'async') {
        this.query.pageNum = this.selectedPageNum
        this.query.searchKey = this.searchKey
        this.query.page = this.currentPage
      }

      const requestHead = {
        method: this.tableParam.method,
        url: this.tableParam.url
      }
      // 默认get方式
      if (this.tableParam.method === 'POST' || this.tableParam.method === 'post') {
        requestHead.data = this.query
      } else {
        requestHead.params = this.query
      }
      axios(requestHead)
      .then((response) => {
        this.total = response.data.data.count
        this.resultData = response.data.data.list
        this.initData = response.data.data.list
        this.processData()
      }, (err) => {
        const { errCb } = this.tableParam;
        if (errCb && typeof errCb === 'function') {
          this.tableParam.errCb(err)
        }
      })
    }
  },
  watch: {
    searchKey (val, oldval) {
      if (this.tableParam.type === 'async') {
        this.fetchData()
      } else {
        let searchRegex = new RegExp(val, 'i')
        let arr = []
        let items = this.initData
        let count = this.initData.length
        for (let i = 0; i < count; i++) {
          let flag = true
          for (let key in items[i]) {
            if (flag && searchRegex.test(items[i][key])) {
              arr.push(items[i])
              flag = false
            }
          }
        }
        this.total = arr.length
        this.resultData = arr
        this.processData()
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
<style scoped src="./style.css"></style>
<style scoped lang="css">
.smartTable {
  font-size: 14px;
}
.smartTable .header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.header .select select{
  width:50px;
  height:30px;
  border: none;
  background: #fff;
  border: 1px solid #333;
  border-radius:5px;
  margin: 0 5px; 
  outline: none;
}
.search input{
  border: 1px solid #dddddd;
  width: 240px;
  height:30px;  
  border-radius:3px;
  padding-left: 5px;
  outline: none;
}
.table {
  width: 100%;
  max-width: 100%;
  border: 1px solid #ddd;
}
.table thead > tr > th,
.table tbody > tr > td {
  padding: 6px;
  vertical-align: inherit;
  border: 1px solid #ddd;
  text-align:center;
}
.footer {
  display: flex;
  justify-content: space-between;
  height:30px;
}
.footer .pagination{
  margin: 0;
}
.footer .pagination ul{
  margin: 0;
  padding: 0;
  list-style:none;
  display:flex;
}
.footer .pagination ul li {
  float: left;
  width: 50px;
  height: 30px;
  text-align: center;
  line-height:30px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.footer .pagination ul li :not(:first-child) {
  border-left: none;
}

.footer .pagination ul .active{
  background-color:#5db4e6;
}

.footer .pagination ul li :hover{
  background-color:#ddd;
}

.footer .pagination ul .disabled{
  cursor:not-allowed !important;
}

.footer .pagination .lastPage {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}
.footer .pagination .firstPage {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
</style>
