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
      if (!this.HasAnyValue(IDs)) {
        this[targetOptions] = []
      } else {
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
      }
    },
    MakeQueryStringFromSearchConditions () {
      const queryString = Object.keys(this.searchConditions)
      .filter(key => this.HasAnyValue(this.searchConditions[key]))
      .map(key => key + '=' + this.searchConditions[key])
      .join('&')
      return queryString
    },
    setInitialOptionsForSearchSelect(url, target, ids) {
        if (this[target].length === 0 && ids.length > 0) {
          this.SetCategoryOptionsForSelect(url, target, ids)
        }
    },
    IsFormValuesChanged(formValuesBeforeEdit, formValues, formKeys) {
      var result = false
  
      formKeys.forEach(key => {
        if (formValuesBeforeEdit[key] != formValues[key]) {
          result = true
        }
      })
  
      return result
    }
  }
}