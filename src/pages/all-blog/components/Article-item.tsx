import { View, Text, Image } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { AtIcon, AtBadge, AtTag } from 'taro-ui'
import PropTypes from 'prop-types'

class aricleItem extends Component {
  // static externalClasses = ['my-class']
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    dataSource: {}
  }
  static propTypes = {
    dataSource: PropTypes.shape({
      color: PropTypes.string,
      fontSize: PropTypes.number
    })
  }

  constructor(props) {
    super(props)
  }

  render() {
    let { dataSource } = this.props
    return (
      <View
        // className="my-class"
        className="ArticleItem"
      >
        <View className="image-content">
          <Image className="item-image" mode="aspectFill" src={`https://ruraltech.cn${dataSource.imageUrl}`} />
        </View>
        <View style="margin:15px">
          <View className="text-content">
            <Text className="title">{dataSource.title}</Text>
            <View className="info-base">
              <View>
                <AtIcon value="calendar" size="14"></AtIcon>
                <Text className="time"> {Taro.$utils.formatTime(dataSource.addTime, '{y}-{m}-{d}')}</Text>
              </View>
              <View className="scan">
                <AtIcon value="eye" size="16"></AtIcon>
                <Text className="eye">{dataSource.pageView}</Text>
              </View>
              <AtBadge value={dataSource.likePeople} maxValue={99}>
                <AtIcon value="heart-2" size="16"></AtIcon>
              </AtBadge>
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
            <View className="intro">{dataSource.intro}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default aricleItem
