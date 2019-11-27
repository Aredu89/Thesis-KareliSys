import React from 'react'

export default class Link extends React.Component {
  render () {
    return (
    <div>Link...{this.props.params.id}</div>
    )
  }
}