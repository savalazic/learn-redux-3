import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'

import { connect } from 'react-redux'
import { createPost } from '../actions'

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
    this.props.createPost(values, () => {
      this.props.history.push('/')
    })
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
        <Link to='/' className='btn btn-danger'>Cancel</Link>
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
})(
  connect(null, { createPost })(PostsNew)
)