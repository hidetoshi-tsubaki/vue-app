export default {
  methods: {
    changeFormat(date, format) {
      date = new Date(date)
      format = format.replace(/yyyy/g, date.getFullYear())
      format = format.replace(/M/g, (date.getMonth() + 1))
      format = format.replace(/d/g, (date.getDate()))
      format = format.replace(/H/g, (date.getHours()))
      format = format.replace(/m/g, (date.getMinutes()))
      format = format.replace(/s/g, (date.getSeconds()))
      format = format.replace(/S/g, (date.getMilliseconds()))
      return format
    },
    truncate (text, length, suffix) {
      if (text.length >= length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    }
  }
}