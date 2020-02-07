import io from './io'
let articleAll = []

/**
 * 更具时间对归档数据进行整理处理
 */
function formatArticle(source) {
  const map = {}
  const dest = []
  for (let i = 0; i < source.length; i++) {
    const item = source[i]
    const indexesOne = item.addTime.substr(0, 4)
    if (!map[indexesOne]) {
      dest.push({
        StartTime: indexesOne,
        data: [item]
      })
      map[indexesOne] = item
    } else {
      for (let j = 0; j < dest.length; j++) {
        const dj = dest[j]
        const indexesTwo = item.addTime.substr(0, 4)
        if (dj.StartTime === indexesTwo) {
          dj.data.push(item)
          break
        }
      }
    }
  }
  function getMonth(data) {
    const map = {}
    const dest = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      const indexesOne = item.addTime.substr(5, 2)
      if (!map[indexesOne]) {
        dest.push({
          StartTime: indexesOne,
          data: [item]
        })
        map[indexesOne] = item
      } else {
        for (let j = 0; j < dest.length; j++) {
          const dj = dest[j]
          const indexesTwo = item.addTime.substr(5, 2)
          if (dj.StartTime === indexesTwo) {
            dj.data.push(item)
            break
          }
        }
      }
    }
    return dest
  }
  dest.forEach(element => {
    element.data = getMonth(element.data)
  })

  return dest
}

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
    },
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
            return resolve(formatArticle(articleAll))
          })
          .catch(e => {
            reject(e)
          })
      } else {
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
