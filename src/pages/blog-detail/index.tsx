import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import ParserRichText from './../../components/ParserRichText/parserRichText'

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
            {/* <ParserRichText html={dataSource.contentHtml}></ParserRichText> */}
            {/* <View className="at-article__section">
              <View className="at-article__h2">这是二级标题</View>
              <View className="at-article__h3">这是三级标题</View>
              <View className="at-article__p">
                这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本段落。这是文本落。这是文本段落。1234567890123456789012345678901234567890
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </View>
              <View className="at-article__p">这是文本段落。这是文本段落。</View>
              <Image className="at-article__img" src="https://jdc.jd.com/img/400x400" mode="widthFix" />
            </View> */}
          </View>
        </View>
      </View>
    )
  }
}
export default Index as ComponentClass<PageOwnProps, PageState>
