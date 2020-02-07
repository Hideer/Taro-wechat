export default {
  /**
   * 将时间转换成指定格式。
   *
   * @param time
   * @param cFormat
   */
  formatTime(time, cFormat) {
    if (arguments.length === 0) {
      return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (('' + time).length === 10) time = parseInt(time) * 1000
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  },
  /**
   * 获取递归数组的最内部长度
   *
   * @param treeData
   */
  getMaxFloor(treeData, key) {
    //获取树长度
    let max = 0
    function each(data) {
      for (let i = 0; i < data.length; i++) {
        // max++
        if (data[i][key]) {
          each(data[i][key])
        } else {
          max++
        }
      }
    }
    each(treeData)
    return max
  }
}
