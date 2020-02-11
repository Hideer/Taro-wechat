import io from './io'
let articleAll = []

/**
 * 更具时间对归档数据进行整理处理
 */
function formatArticle(source) {
  function tree(data, type) {
    const map = {}
    const dest = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const indexOne = type == 'year' ? item.addTime.substr(0, 4) : item.addTime.substr(5, 2) // 获取月
      if (!map[indexOne]) {
        dest.push({
          StartTime: indexOne,
          data: [item]
        })
        map[indexOne] = item
      } else {
        for (let j = 0; j < dest.length; j++) {
          const children = dest[j]
          const indexTwo = type == 'year' ? item.addTime.substr(0, 4) : item.addTime.substr(5, 2)
          if (children.StartTime === indexTwo) {
            children.data.push(item)
            break
          }
        }
      }
    }
    return dest
  }

  let dest = tree(source, 'year')
  dest.forEach(ele => {
    ele.data = tree(ele.data, 'month')
  })
  return dest
}

function formatArticle2(source) {
  // source = source.map(element => {
  //   return {
  //     yearTime: element.addTime.substr(0, 4),
  //     monthTime: element.addTime.substr(5, 2),
  //     value: element
  //   }
  // })
  // console.log(source)

  // let map = {}
  // function tree(parent) {
  //   console.log('parent', parent)
  //   let arr = []
  //   let sources = []

  //   if (parent) {
  //     if (parent.length == 4) {
  //       sources = source.filter(item => {
  //         return item.yearTime === parent
  //       })
  //     } else if (parent.length == 2) {
  //       sources = source.filter(item => {
  //         return item.monthTime === parent
  //       })
  //     }
  //   } else {
  //     sources = source
  //   }

  //   for (let i = 0; i < sources.length; i++) {
  //     const ele = sources[i]
  //     console.log(ele)
  //     // console.log(parent.length)

  //     // if (!map[ele.yearTime]) {
  //     arr.push({
  //       yearTime: ele.yearTime,
  //       monthTime: ele.monthTime,
  //       children: tree(ele.yearTime)
  //       // children: tree(parent.length == 4 ? ele.yearTime : ele.monthTime)
  //     })
  //     // }
  //     console.log('进来了么', arr)
  //   }
  //   return arr
  // }
  // return tree()

  function tree(data, type) {
    const map = {}
    const dest = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const indexOne = type == 'year' ? item.addTime.substr(0, 4) : item.addTime.substr(5, 2) // 获取月
      if (!map[indexOne]) {
        dest.push({
          StartTime: indexOne,
          data: [item]
        })
        map[indexOne] = item
      } else {
        for (let j = 0; j < dest.length; j++) {
          const children = dest[j]
          const indexTwo = type == 'year' ? item.addTime.substr(0, 4) : item.addTime.substr(5, 2)
          if (children.StartTime === indexTwo) {
            children.data.push(item)
            break
          }
        }
      }
    }
    return dest
  }

  let dest = tree(source, 'year')
  dest.forEach(ele => {
    ele.data = tree(ele.data, 'month')
  })
  return dest
}

/**
 * 更具数据处理数据标签
 *
 * @param source 数据源
 */
function formatArticleTag(source: Array<any>): Array<any> {
  let tagArticle = []
  let dict = []
  source.forEach(ele => {
    let data = ele.labels.map(item => {
      return {
        title: item.name,
        value: [ele]
      }
    })
    dict = dict.concat(data)
  })
  dict.forEach((data: any) => {
    const hasitem = tagArticle.some((item: any) => {
      if (item.title == data.title) {
        item.value.push(...data.value)
      }
      return item.title == data.title
    })
    hasitem ||
      tagArticle.push({
        title: data.title,
        value: [...data.value]
      })
  })
  return tagArticle || []
}

/**
 * 获取具体文章数据
 *
 * @param source 数据源
 * @param id 文章id
 */
// getAppointDetail 获取具体文章
function getAppointDetail(source: Array<any> = [], id: String) {
  for (const iterator of source) {
    if (iterator._id == id) {
      return iterator
    }
  }
}

export default {
  getArticle(data) {
    const config = {
      method: 'get',
      url: '/Article/list',
      data: data
    }
    return io(config)
  },
  // 文章时间轴
  getArticleAll(
    data: object = {
      issueStatus: 1
    }
  ) {
    const config = {
      method: 'get',
      url: '/Article/list',
      data: data,
      isShowLoading: true
    }
    return new Promise((resolve, reject) => {
      if (articleAll.length === 0) {
        io(config)
          .then(res => {
            articleAll = res.data
            console.log(formatArticle2(articleAll))
            return resolve(formatArticle(articleAll))
          })
          .catch(e => {
            reject(e)
          })
      } else {
        console.log(formatArticle2(articleAll))
        return resolve(formatArticle(articleAll))
      }
    })
  },
  // 文章标签
  getArticleTag(
    data: object = {
      issueStatus: 1
    }
  ) {
    const config = {
      method: 'get',
      url: '/Article/list',
      data: data
    }
    return new Promise((resolve, reject) => {
      if (articleAll.length === 0) {
        io(config)
          .then(res => {
            articleAll = res.data
            return resolve(formatArticleTag(articleAll))
          })
          .catch(e => {
            reject(e)
          })
      } else {
        return resolve(formatArticleTag(articleAll))
      }
    })
  },
  // 获取文章详情
  getArticleDetail(
    id: string,
    data: object = {
      issueStatus: 1
    }
  ) {
    const config = {
      method: 'get',
      url: '/Article/list',
      data: data
    }
    return new Promise((resolve, reject) => {
      if (articleAll.length === 0) {
        io(config)
          .then(res => {
            articleAll = res.data
            return resolve(getAppointDetail(articleAll, id))
          })
          .catch(e => {
            reject(e)
          })
      } else {
        return resolve(getAppointDetail(articleAll, id))
      }
    })
  }
}
