const axios = require("axios")

module.exports.setToken = token => {
  if (token) {
    // Apply authorization token to every request if logged in
    axios.defaults.headers.common["Authorization"] = token
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"]
  }
}