# Redux Notes

## React Router

### How it works?

<img src="http://i.imgur.com/dnCmAK3.png" />

### Router Sample
```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom'

import App from './components/app';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

class Hello extends React.Component {
  render() {
    return <div>Hello</div>
  }
}

class Goodbye extends React.Component {
  render() {
    return <div>Goodbye</div>
  }
}

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <App />
        <Route path='/hello' component={Hello} />
        <Route path='/goodbye' component={Goodbye} />
      </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));
```

<img src="http://i.imgur.com/l7bP9p8.png" />

```
const posts = [
  { id: 4, title: 'hi' },
  { id: 25, title: 'bye' },
  { id: 36, title: 'how it going?' }, 
]

const state = _.mapKeys(posts, 'id')
console.log(state) // {"4":{"id":4,"title":"hi"},"25":{"id":25,"title":"bye"},"36":{"id":36,"title":"how it going?"}}
console.log(state[4]) // prints: {"id": 4, "title": "hi"}
```

`reducers/reducer_posts.js`
```
import { FETCH_POSTS } from '../actions'
import _ from 'lodash'

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_POSTS:
      return _.mapKeys(action.payload.data, 'id')
    default:
      return state
  }
}
```

### Action Creators Shortcuts

`components/posts_index.js`

```
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPosts } from '../actions'
    
class PostsIndex extends Component {
  render() {
    return (
      <div>Posts Index</div>
    )
  }
}

export default connect(null, { fetchPosts })(PostsIndex)
```

### Fetch data with react lifecycle

`components/posts_index.js`

```
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
```

### Render list of posts

`components/posts_index.js`

```
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPosts } from '../actions'

class PostsIndex extends Component {

  componentDidMount() {
    // perfect place to fetch data
    this.props.fetchPosts()
  }

  renderPosts() {
    // lodash function that returns array (from object)
    return _.map(this.props.posts, post => {
      return (
        <li className='list-group-item' key={post.id}>
          {post.title}
        </li>
      )
    })
  }

  render() {
    console.log(this.props.posts)
    return (
      <div>
        <h3>Posts</h3>
        <ul className='list-group'>
          {this.renderPosts()}
        </ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts
  }
}

export default connect(mapStateToProps, { fetchPosts })(PostsIndex)
```