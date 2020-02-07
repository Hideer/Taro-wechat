import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem, Audio } from '@tarojs/components'
import { AtFab, AtNoticebar, AtDrawer, AtAccordion, AtList, AtListItem, AtIcon, AtMessage } from 'taro-ui'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
import { hide, show } from '../../actions/app'

import './index.scss'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
  app: {
    meauDisplay: boolean
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
  hide: () => void
  show: () => void
}

type PageOwnProps = {}

type PageState = {
  open: boolean
  dataSour: Array<any>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

type IState = PageState

interface Index {
  props: IProps
  state: IState
}

@connect(
  ({ counter, app }) => ({
    counter,
    app
  }),
  dispatch => ({
    add() {
      dispatch(add())
    },
    dec() {
      dispatch(minus())
    },
    asyncAdd() {
      dispatch(asyncAdd())
    },
    show() {
      dispatch(show())
    },
    hide() {
      dispatch(hide())
    }
  })
)
class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我们'
  }

  constructor() {
    super(...arguments)
    this.state = {
      open: false,
      dataSour: [
        {
          mainUrl: 'http://q5c6ka0m1.bkt.clouddn.com/Image/pfsj-mind',
          backUrl: 'http://q5c6ka0m1.bkt.clouddn.com/Image/pfsj',
          animationMain: null, //正面
          animationBack: null //背面
        },
        {
          mainUrl:
            'https://t7.baidu.com/it/u=3225540498,2642373837&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1581692268&t=c44e770430b310ce4b41491095fefc35',
          backUrl:
            'https://t9.baidu.com/it/u=1035365258,2010616359&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1581692379&t=91c426395d79568183c8a72a3478839c',
          animationMain: null, //正面
          animationBack: null //背面
        }
      ]
    }
  }

  onAccordionOpen(value) {
    this.setState({
      open: value
    })
  }

  noCode(value) {
    Taro.atMessage({
      type: 'warning',
      message: value
    })
  }

  onFlip(index, type) {
    let animation_main = Taro.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    let animation_back = Taro.createAnimation({
      duration: 400,
      timingFunction: 'linear'
    })
    // 点击正面
    if (type == 'main') {
      animation_main.rotateY(180).step()
      animation_back.rotateY(0).step()
      let dataSour = this.state.dataSour
      dataSour[index] = {
        ...dataSour[index],
        animationMain: animation_main.export(),
        animationBack: animation_back.export()
      }
      this.setState({
        dataSour
      })
    }
    // 点击背面
    else {
      animation_main.rotateY(0).step()
      animation_back.rotateY(-180).step()
      let dataSour = this.state.dataSour
      dataSour[index] = {
        ...dataSour[index],
        animationMain: animation_main.export(),
        animationBack: animation_back.export()
      }
      this.setState({
        dataSour
      })
    }
  }

  musicPlay() {
    // Taro.atMessage({
    //   message: '音乐播放'
    // })
    // Taro.playBackgroundAudio({
    //   dataUrl: 'http://music.163.com/song/media/outer/url?id=317151.mp3',
    //   title: '心雨',
    //   coverImgUrl:
    //     'https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
    // }).then(data => {
    //   console.log(data)
    // })
  }

  taroRoute(url) {
    Taro.navigateTo({
      url
    })
  }

  componentWillMount() {
    // Taro.atMessage({
    //   message: '背景音乐播放~'
    // })
    Taro.playBackgroundAudio({
      dataUrl: 'http://music.163.com/song/media/outer/url?id=317151.mp3',
      title: '心雨',
      coverImgUrl:
        'https://camo.githubusercontent.com/3e1b76e514b895760055987f164ce6c95935a3aa/687474703a2f2f73746f726167652e333630627579696d672e636f6d2f6d74642f686f6d652f6c6f676f2d3278313531333833373932363730372e706e67'
    }).then(data => {
      console.log(data)
      Taro.atMessage({
        message: '背景音乐播放~'
      })
    })
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
    // Taro.playBackgroundAudio(params).then(...)
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    let { dataSour, open } = this.state
    return (
      <View className="index">
        <AtMessage />
        <AtNoticebar
          className="noticebar-info"
          single
          showMore
          icon="volume-plus"
          onGotoMore={() => {
            Taro.atMessage({
              message:
                '我还是相信 星星会说话 石头会开花 穿过夏天的木栅栏和冬天的风雪之后 你终会抵达-因为爱着，就算痛到极致，我们不会老去。'
            })
          }}
        >
          我还是相信 星星会说话 石头会开花 穿过夏天的木栅栏和冬天的风雪之后 你终会抵达
          -因为爱着，就算痛到极致，我们不会老去。
        </AtNoticebar>
        <Swiper
          className="swiper-container"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          vertical
          circular
          indicatorDots
        >
          {dataSour.map((item, index) => {
            return (
              <SwiperItem key={index}>
                <View className="swiper-content">
                  <View
                    className="swiper-item positive"
                    animation={item.animationMain}
                    onClick={this.onFlip.bind(this, index, 'main')}
                  >
                    <Image className="swiper-item-image" mode="aspectFit" src={item.mainUrl} />
                  </View>
                  <View
                    className="swiper-item back"
                    animation={item.animationBack}
                    onClick={this.onFlip.bind(this, index, 'back')}
                  >
                    <Image className="swiper-item-image" mode="aspectFit" src={item.backUrl} />
                  </View>
                </View>
                {/* <View className="flip-btn" onClick={this.musicPlay.bind(this)}>
                  <AtIcon value="repeat-play" size="40"></AtIcon>
                </View> */}
              </SwiperItem>
            )
          })}
        </Swiper>
        <AtDrawer show={this.props.app.meauDisplay} mask onClose={this.props.hide.bind(this)}>
          <AtAccordion
            open={open}
            onClick={this.onAccordionOpen.bind(this)}
            title="Blog"
            icon={{ value: 'file-code', color: 'red', size: '16' }}
          >
            <AtList hasBorder={false}>
              <AtListItem title="All" onClick={this.taroRoute.bind(this, '/pages/all-blog/index')} />
              <AtListItem title="Archive" onClick={this.taroRoute.bind(this, '/pages/archive/index')} />
              <AtListItem title="Tags" onClick={this.taroRoute.bind(this, '/pages/tags-blog/index')} />
            </AtList>
          </AtAccordion>
          {/* <AtAccordion
            onClick={this.noCode.bind(this, '功能紧急开发中')}
            title="Soft"
            icon={{ value: 'lightning-bolt', color: 'red', size: '16' }}
          ></AtAccordion>
          <AtAccordion
            onClick={this.noCode.bind(this, '功能紧急开发中')}
            title="We"
            icon={{ value: 'heart', color: 'red', size: '16' }}
          ></AtAccordion> */}
        </AtDrawer>
        <View className="atfab-btn">
          <AtFab onClick={this.props.show.bind(this)}>
            <Text className="at-fab__icon at-icon at-icon-menu"></Text>
          </AtFab>
        </View>
        {/* <Button className='add_btn' onClick={this.props.add}>
          +
        </Button>
        <Button className='dec_btn' onClick={this.props.dec}>
          -
        </Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>
          async
        </Button>
        <View>
          <Text>{this.props.counter.num}</Text>
        </View>
        <View>
          <Text>Hello, World123123</Text>
        </View> */}
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
