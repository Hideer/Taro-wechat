import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtLoadMore } from 'taro-ui'

//  文章cell
import ArticleItem from './components/Article-item'
import './index.scss'

import ApiServer from './../../api/index'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {
  page: number
}

type PageState = {
  listStatus: any
  dataList: any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps
  state: PageState
}

class Index extends Component {
  config: Config = {
    navigationBarTitleText: '所有文章',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50
  }

  constructor(props) {
    super(props)
    this.state = {
      listStatus: 'more',
      dataList: []
    }
    this.props.page = 1
  }

  componentWillMount() {
    this.fetchDate(1)
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onPullDownRefresh() {
    // Taro.stopPullDownRefresh() //停止下拉动作过渡
    this.setState(
      {
        listStatus: 'more',
        dataList: []
      },
      () => {
        console.log('下拉事件')
        this.fetchDate(1)
      }
    )
  } //下拉事件

  onReachBottom() {
    console.log('上拉事件')
    this.fetchDate()
  } //上拉事件监听

  async fetchDate(page?: number) {
    if (this.state.listStatus === 'more') {
      // 开始加载
      this.setState({
        listStatus: 'loading'
      })
      if (page == void 0) {
        this.props.page += 1
      } else {
        this.props.page = 1
      }
      let params = {
        page: this.props.page,
        limit: 5,
        issueStatus: 1
      }
      let res = await ApiServer.Blog.getArticle(params)
      console.log(res);
      
      let dataList = this.state.dataList.concat(res.data.object || [])
      if (this.props.page >= res.data.page.pageCount) {
        // 没有更多了
        this.setState({
          listStatus: 'noMore',
          dataList
        })
      } else {
        this.setState({
          listStatus: 'more',
          dataList
        })
      }
    } else {
      Taro.stopPullDownRefresh() //停止下拉动作过渡
    }
  }

  render() {
    return (
      <View className="all-blog-index">
        {this.state.dataList.map((item, index) => {
          return (
            <View
              key={item._id}
              onClick={() => {
                 Taro.navigateTo({
                   url: `/pages/blog-detail/index?id=${item._id}&title=${item.title}`
                 })
              }}
            >
              <ArticleItem dataSource={item} my-class="ArticleItem" />
            </View>
          )
        })}
        <AtLoadMore status={this.state.listStatus} moreText="加载更多" onClick={this.fetchDate.bind(this)} />
      </View>
    )
  }
}

export default Index as ComponentClass<PageOwnProps, PageState>
