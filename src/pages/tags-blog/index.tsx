import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'

//  文章cell
import ArticleItem from './../all-blog/components/Article-item'
import './index.scss'

import ApiServer from './../../api'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  current: number
  dataSource: Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps
  state: PageState
}

class Index extends Component {
  config: Config = {
    navigationBarTitleText: '标签'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
      dataSource: []
    }
  }
  componentDidMount() {
    this.featDate()
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  tabsOnClike(v) {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    this.setState(
      {
        current: v
      },
      () => {
        Taro.hideLoading()
      }
    )
  }

  async featDate() {
    let res = await ApiServer.Blog.getArticleTag()
    this.setState({
      dataSource: res
    })
  }

  render() {
    let { current, dataSource } = this.state
    return (
      <View className="tags-page">
        <AtTabs
          current={current}
          scroll
          height="100vh"
          tabDirection="vertical"
          tabList={dataSource}
          onClick={this.tabsOnClike.bind(this)}
        >
          {dataSource.map((item, index) => {
            return (
              <AtTabsPane key={item.title} tabDirection="vertical" current={current} index={index}>
                {item.value
                  ? item.value.map(i => {
                      return (
                        <View
                          key={i._id}
                          onClick={() => {
                            Taro.navigateTo({
                              url: `/pages/blog-detail/index?id=${i._id}&title=${i.title}`
                            })
                          }}
                        >
                          <ArticleItem dataSource={i} my-class="ArticleItem" />
                        </View>
                      )
                    })
                  : null}
              </AtTabsPane>
            )
          })}
        </AtTabs>
      </View>
    )
  }
}
export default Index as ComponentClass<PageOwnProps, PageState>
