import { Todo } from "../models/todo.models";
import { createTodoHtml } from "./create-todo-html.js";

let element;
/**
 *
 * @param {String} elementId
 * @param {Todo} todos
 */

export const renderTodos = (elementId, todos = []) => {
  if (!element) element = document.querySelector(elementId);

  if (!element) throw new Error(`Element ${elementId} not found`);

  console.log({ elementId }, { todos });
  element.innerHTML = "";

  todos.forEach((todo) => {
    element.append(createTodoHtml(todo));
  });
};
