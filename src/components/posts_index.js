import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPosts } from '../actions'

class PostsIndex extends Component {

  componentDidMount() {
    // perfect place to fetch data
    this.props.fetchPosts()
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}

export default connect(null, { fetchPosts })(PostsIndex)