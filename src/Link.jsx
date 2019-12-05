import React from 'react'

export default class Link extends React.Component {
  render () {
    return (
    <div className="link">Link...{this.props.params.id}</div>
    )
  }
}