import html from "./app.html?raw";
import todoStore, { Filters } from "../store/todo.store.js";
import { renderTodos } from "./use-cases/render-todos.js";
import { renderPendingTodos } from "./use-cases/render-pending.js";

const ElementIDs = {
  ClearCompleted: ".clear-completed",
  TodoList: ".todo-list",
  NewTodoInput: "#new-todo-input",
  SelectedFilterButton: ".filtro",
  PendingCountLabel: "#pending-count",
};

export const App = (elementId) => {
  const displayTodos = () => {
    const todos = todoStore.getTodos(todoStore.getCurrentFilter());

    renderTodos(ElementIDs.TodoList, todos);
    updatePendingCount();
  };

  const updatePendingCount = () => {
    renderPendingTodos(ElementIDs.PendingCountLabel);
  };

  //the App is called
  (() => {
    const app = document.createElement("div");
    app.innerHTML = html;
    document.querySelector(elementId).append(app);
    displayTodos();
  })();

  //HTML References
  const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
  const todoListUL = document.querySelector(ElementIDs.TodoList);
  const clearCompletedButton = document.querySelector(
    ElementIDs.ClearCompleted
  );
  const selectedFilterButtonList = document.querySelectorAll(
    ElementIDs.SelectedFilterButton
  );

  //Listeners

  newDescriptionInput.addEventListener("keyup", (event) => {
    if (event.keyCode !== 13) return;
    if (event.target.value.trim().length === 0) return;
    todoStore.addTodo(event.target.value);
    displayTodos();
    event.target.value = "";
  });

  todoListUL.addEventListener("click", (event) => {
    const element = event.target.closest("[data-id]");
    todoStore.toggleTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  todoListUL.addEventListener("click", (event) => {
    const isDestroyButtonElement = event.target.className === "destroy";
    const element = event.target.closest("[data-id]");
    if (!element || !isDestroyButtonElement) return;
    todoStore.deleteTodo(element.getAttribute("data-id"));
    displayTodos();
  });

  clearCompletedButton.addEventListener("click", () => {
    todoStore.deleteCompleted();
    displayTodos();
  });

  selectedFilterButtonList.forEach((element) => {
    element.addEventListener("click", (element) => {
      selectedFilterButtonList.forEach((item) =>
        item.classList.remove("selected")
      );
      element.target.classList.add("selected");

      switch (element.target.text) {
        case "Todos":
          return todoStore.setFilter(Filters.All);
        case "Pendientes":
          return todoStore.setFilter(Filters.Pending);
        case "Completados":
          return todoStore.setFilter(Filters.Completed);
      }
      displayTodos();
      // switch (element.target.getAttribute("href")) {
      //   case "#/":
      //     return todoStore.setFilter(Filters.All);
      //     break;
      //   case "#/active":
      //     return todoStore.setFilter(Filters.Pending);
      //     break;
      //   case "#/completed":
      //     return todoStore.setFilter(Filters.Completed);
      //     break;
      // }
    });
  });
};
