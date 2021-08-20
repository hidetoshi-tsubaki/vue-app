import store from '../store'

export default {
  methods: {
    ChangeFormat(date, format) {
      date = new Date(date)
      format = format.replace(/yyyy/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
      return format;
    },
    Truncate (text, length, suffix) {
      if (text.length >= length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
    HasAnyValue (object) {
      if (typeof object === "undefined") {
        return false
      } else if (typeof object === "boolean") {
        return object === true
      } else if (object != "object" && !object) {
        return false
      } else if (object === null) {
        return false
      } else if (Array.isArray(object) && object.length === 0) {
        return false
      } else if (object != null && typeof (object) === 'object' && object.constructor === Object) {
        return Object.keys(object) > 0
      } else {
        return true
      }
    },
    RemoveEmptyValue(object) {
      const resultObject = Object.keys(object)
        .filter(key => this.HasAnyValue(object[key]))
        .reduce(function (result, key) {
          result[key] = object[key]
          return result
        }, {})
        return resultObject
    },
    GetCategoryOptions (url, IDs) {
      url += '?ids=' + IDs
      return this.$adminHttp.get(url)
      .then(response => response.data)
    },
    SetCategoryOptionsForSelect (url, targetOptions, IDs) {
      this.GetCategoryOptions(url, IDs)
      .then(data => {
        if (data.ErrorMessages != null) {
          console.log(data.ErrorMessages)
          store.dispatch('flashMessage/set', {
            type: 'warning',
            message: 'Failed to get data ...'
          })
        }
        this[targetOptions] = data
      })
    },
    Search (searchConditions, url, page) {
      searchConditions.page = page
      searchConditions = this.RemoveEmptyValue(searchConditions)
      this.$router.push({ query: searchConditions })
      const queryString = Object.keys(searchConditions).map(key => key + '=' + searchConditions[key]).join('&')
      if (queryString) {
        url += '?' + queryString
      }
      this.$adminHttp.get(url)
        .then(response => {
          if (response.data.ErrorMessages != null) {
            this.setFalshMessage({
              type: 'warning',
              message: 'Failed to get data ...'
            })
          } else {
            this.tableData = response.data.Items
            this.itemsTotalCount = response.data.ItemsTotalCount
            this.currentPage = 1
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    SetQueryParamsFromSearchConditions (searchConditions) {
      const query = this.RemoveEmptyValue(searchConditions)
      this.$router.push({ query: query })
    },
    MakeQueryStringFromSearchConditions () {
      const queryString = Object.keys(this.searchConditions)
      .filter(key => this.HasAnyValue(this.searchConditions[key]))
      .map(key => key + '=' + this.searchConditions[key]).join('&')
      return queryString
    },
    ParseQueryAndSetSearchConditions () {
      const params = this.$route.query
      let queryParams = Object.assign({}, params)
      const keys = ['selectedQuizLevelIDs', 'selectedQuizSectionsIDs', 'selectedQuizTitlesIDs', 'page']
      keys.forEach(key => {
        if (Array.isArray(queryParams[key])) {
          queryParams[key] = queryParams[key].map(Number)
        } else if (queryParams[key] != null){
          queryParams[key] = [Number(queryParams[key])]
        }
      })
      Object.assign(this.searchConditions, queryParams)
    },
    ClearSearchConditions () {
      if (window.confirm("Are you sure you wnat to clear 'All' search conditions")) {
        this.searchConditions = Object.assign({}, this.defaultSearchConditions)
      }
    }
  }
}