import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, RichText, WebView } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import { TaroRichTextNoWxParse } from 'taro_rich_text'

import './index.scss'

import ApiServer from './../../api/index'

type PageStateProps = {}

type PageDispatchProps = {}

type PageOwnProps = {}

type PageState = {
  dataSource?: any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps
  state: PageState
}

class Index extends Component {
  config: Config = {
    navigationBarTitleText: `文章-详情`
  }

  constructor(props) {
    super(props)
    this.state = {
      dataSource: {}
    }
  }

  componentWillMount() {
    this.featData()
    Taro.setNavigationBarTitle({
      title: this.$router.params.title
    })
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async featData() {
    let res = await ApiServer.Blog.getArticleDetail(this.$router.params.id)
    this.setState({
      dataSource: res
    })
  }

  render() {
    let { dataSource } = this.state
    return (
      <View className="blog-detail">
        {/* <WebView src="https://ruraltech.cn/blog/2020-01-05/Mocha%E5%8D%95%E5%85%83%E6%B5%8B%E8%AF%95" /> */}
        <View className="at-article">
          <View className="at-article__h1">{dataSource.title}</View>
          <View className="at-article__info">
            {Taro.$utils.formatTime(dataSource.addTime, '{y}-{m}-{d}')} {dataSource.author.name}
          </View>
          <View className="info-tag">
            {Array.isArray(dataSource.labels) &&
              dataSource.labels.map(item => {
                return (
                  <AtTag key={item.id} className="tag" size="small" circle active>
                    {item.name}
                  </AtTag>
                )
              })}
          </View>
          <View className="at-article__content">
            <RichText nodes={dataSource.contentHtml} />
            <TaroRichTextNoWxParse raw={false} type="markdown" richText={dataSource.content} />
          </View>
        </View>
      </View>
    )
  }
}
export default Index as ComponentClass<PageOwnProps, PageState>
