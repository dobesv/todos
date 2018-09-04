import { displayError } from '../helpers/errors.js';
import React from 'react';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import classnames from 'classnames';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';
import Radium from 'radium';

import { remove, setCheckedStatus, updateText } from '../../api/todos/methods.js';

class TodoItem extends BaseComponent {
  constructor(props) {
    super(props);
    this.throttledUpdate = _.throttle((value) => {
      if (value) {
        updateText.call({
          todoId: this.props.todo._id,
          newText: value,
        }, displayError);
      }
    }, 300);

    this.setTodoCheckStatus = (event) => {
      console.log(this.props);
      setCheckedStatus.call({
        todoId: this.props.todo._id,
        newCheckedStatus: event.target.checked,
      });
    };
    this.updateTodo = (event) => {
      console.log(this.props);
      this.throttledUpdate(event.target.value);
    };
    this.deleteTodo = () => {
      console.log(this.props);
      remove.call({ todoId: this.props.todo._id }, displayError);
    };
    this.onFocus = () => {
      console.log(this.props);
      this.props.onEditingChange(this.props.todo._id, true);
    };
    this.onBlur = () => {
      console.log(this.props);
      this.props.onEditingChange(this.props.todo._id, false);
    };
    this.checkEditing = () => this.props.editing;
  }

  render() {
    const { todo, editing } = this.props;
    const todoClass = classnames({
      'list-item': true,
      checked: todo.checked,
      editing,
    });

    return (
      <div className={todoClass}>
        <label className="checkbox" htmlFor={this.props.todo._id}>
          <input
            id={this.props.todo._id}
            type="checkbox"
            checked={todo.checked}
            name="checked"
            onChange={this.setTodoCheckStatus}
          />
          <span className="checkbox-custom" />
        </label>
        <input
          type="text"
          defaultValue={todo.text}
          placeholder={i18n.__('components.todoItem.taskName')}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChange={this.updateTodo}
        />
        <a
          className="delete-item"
          href="#delete"
          onClick={this.deleteTodo}
          onMouseDown={this.deleteTodo}
        >
          <span className="icon-trash" />
        </a>
        <p>
          {String(!!editing)} ===
          {String(!!this.checkEditing())} ?
        </p>
      </div>
    );
  }
}

export default Radium(TodoItem);

TodoItem.propTypes = {
  todo: PropTypes.object,
  editing: PropTypes.bool,
  onEditingChange: PropTypes.func,
};
