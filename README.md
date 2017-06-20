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

### React router navigation

`index.js`

```
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import promise from 'redux-promise'

import reducers from './reducers';

import PostsIndex from './components/posts_index'
import PostsNew from './components/posts_new'

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/posts/new' component={PostsNew} />
          <Route path='/' component={PostsIndex} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));


// Switch takes collection of different routes
// most specific route at the top
```


`components/posts_index.js`

```
import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
        <div className='text-xs-right'>
          <Link className='btn btn-primary' to='/posts/new'>
            Add a Post
          </Link>
        </div>
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

### Installing Redux-Form
<a href="http://redux-form.com/6.7.0/docs/GettingStarted.md/">Follow official guide</a>

<img src="http://i.imgur.com/C1XsuKr.png" />

`components/post_new.js`

```
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'

class PostsNew extends Component {

  renderField(field) {

    const { meta } = field

    const className = `form-group ${meta.touched && meta.error ? 'has-danger' : ''}` 

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input 
          className='form-control'
          type='text'
          {...field.input}
        />
        <div className='text-help'>
          { meta.touched ? meta.error : '' }
        </div>
      </div>
    )
  }

  onSubmit(values) {
    console.log(values)
  }

  render() {

    const { handleSubmit } = this.props // reduxForm thing..

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Field 
          label='Title'
          name='title'
          component={this.renderField} 
        />
        <Field 
          label='Categories'
          name='categories'
          component={this.renderField} 
        />
        <Field 
          label='Post Content'
          name='content'
          component={this.renderField} 
        />
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    )
  }
}

function validate(values) {
  // console.log(values => {title: 'sadasdsa', categories: 'dsaas', content: 'blablabla'})
  const errors = {}

  // validate the inputs from 'values'
  if (!values.title || values.title.length < 3) {
    errors.title = 'Enter a title that is at least 3 characters'
  }
  if (!values.categories) {
    errors.categories = 'Enter some categories'
  }
  if (!values.content) {
    errors.content = 'Enter some content'
  }

  // if errors is empty, the form is fine to submit
  // if errors has any properties, redux form assumes form is invalid
  return errors
}

export default reduxForm({
  validate: validate,
  form: 'PostNewForm' // a unique name for this form
})(PostsNew)
```

<img src="http://i.imgur.com/4Fkcrvx.png" />

pristine: user not select input yet
touched: user has selected input and focused out
invalid: when error occured


# Submitting data to API

## Create Post Action Creator

`actions/index.js`

```
export function createPost(values) {
  const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)

  return {
    type: CREATE_POST,
    payload: request
  }
}
```

`components/posts_new.js`

```
onSubmit(values) {
  this.props.createPost(values)
}

export default reduxForm({
  validate: validate,
  form: 'PostNewForm' // a unique name for this form
})(
  connect(null, { createPost })(PostsNew)
)
```

### Navigate to index page when post is added

`actions/index.js`

```
export function createPost(values, callback) {
  const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)
    .then(() => callback())

  return {
    type: CREATE_POST,
    payload: request
  }
}
```

`components/posts_new.js`

```
 onSubmit(values) {
    console.log(values)
    this.props.createPost(values, () => {
      this.props.history.push('/')
    })
  }
```

### Implementing Post Show Component

`index.js`

```
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import promise from 'redux-promise'

import reducers from './reducers';

import PostsIndex from './components/posts_index'
import PostsNew from './components/posts_new'
import PostsShow from './components/posts_show'

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <BrowserRouter>
      <div>
        <Switch>
          <Route path='/posts/new' component={PostsNew} />
          <Route path='/posts/:id' component={PostsShow} />
          <Route path='/' component={PostsIndex} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>
  , document.querySelector('.container'));

// Switch takes collection of different routes
// most specific route at the top
```

## /posts/:id to fetch data only for that post

`actions/index.js`

```
import axios from 'axios'

export const FETCH_POSTS = 'FETCH_POSTS'
export const CREATE_POST = 'CREATE_POST'
export const FETCH_POST = 'FETCH_POST'

const ROOT_URL = 'http://reduxblog.herokuapp.com/api'
const API_KEY = '?key=SAVA1234'

export function fetchPosts() {
  const request = axios.get(`${ROOT_URL}/posts${API_KEY}`)

  return {
    type: FETCH_POSTS,
    payload: request
  }
}

export function createPost(values, callback) {
  const request = axios.post(`${ROOT_URL}/posts${API_KEY}`, values)
    .then(() => callback())

  return {
    type: CREATE_POST,
    payload: request
  }
}

export function fetchPost(id) {
  const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`)

  return {
    type: FETCH_POST,
    payload: request
  }
}
```

`reducers/reducer_posts.js`

```
import { FETCH_POSTS, FETCH_POST } from '../actions'
import _ from 'lodash'

export default function(state = {}, action) {
  switch(action.type) {
    case FETCH_POSTS:
      return _.mapKeys(action.payload.data, 'id')
    case FETCH_POST:
      // ES5
      // const post = action.payload.data
      // const newState =  { ...state }
      // newState[post.id] = post
      // return newState

      // ES6
      return { ...state, [action.payload.data.id]: action.payload.data }
    default:
      return state
  }
}
```

`components/posts_show.js`

```
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPost } from '../actions'

class PostsShow extends Component {

  componentDidMount() {
    const { id } = this.props.match.params
    this.props.fetchPost(id)
  }

  render() {
    const { post } = this.props

    if (!post) {
      return <div>Loading...</div>
    }

    return (
      <div>
        <h3>{post.title}</h3>
        <h6>Categories: {post.categories}</h6>
        <p>{post.content}</p>
      </div>
    )
  }

}

function mapStateToProps({ posts }, ownProps) {
  // this.props === ownProps
  return {
    post: posts[ownProps.match.params.id]
  }
}

export default connect(mapStateToProps, { fetchPost })(PostsShow)
```