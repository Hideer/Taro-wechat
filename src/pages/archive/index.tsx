import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

import ApiServer from './../../api'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  dataSource: Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface index {
  props: IProps
  state: PageState
}

class index extends Component {
  config: Config = {
    navigationBarTitleText: 'Archive',
    enablePullDownRefresh: true
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: []
    }
  }
  componentDidMount() {
    // getArticleAll
    this.featData()
  }

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  onPullDownRefresh() {
    this.featData()
  } //下拉事件

  async featData() {
    let res = await ApiServer.Blog.getArticleAll()
    this.setState({
      dataSource: res
    })
  }

  render() {
    let { dataSource } = this.state

    return (
      <View className="archive-page">
        <View className="archive-info">
          <Text>目前共计 {Taro.$utils.getMaxFloor(dataSource, 'data')} 篇文章!</Text>
        </View>
        {dataSource.map(item => {
          return (
            <View key={item.StartTime} className="year-content">
              <Text className="year-text">{item.StartTime}</Text>
              {item.data.map(i => {
                return (
                  <View key={item.StartTime + i.StartTime} className="month-content">
                    <View className="month-text">
                      <Text className="text">
                        {i.StartTime}月({i.data.length || 0}篇)
                      </Text>
                    </View>
                    <View className="day-content">
                      {i.data.map(j => {
                        return (
                          <View
                            key={j._id}
                            className="item-list"
                            onClick={() => {
                              Taro.navigateTo({
                                url: `/pages/blog-detail/index?id=${j._id}&title=${j.title}`
                              })
                            }}
                          >
                            <Text className="time">{Taro.$utils.formatTime(j.addTime, '{m}-{d}')}</Text>
                            <Text className="title">{j.title}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                )
              })}
            </View>
          )
        })}
      </View>
    )
  }
}
export default index as ComponentClass<PageOwnProps, PageState>
