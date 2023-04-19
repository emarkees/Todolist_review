const $todos = document.querySelector('.todoContainer');

export default class Todos {
  constructor() {
    this.todoList = JSON.parse(localStorage.getItem('todoList')) || [];

    if (this.todoList.length > 0) {
      this.todoList.forEach((todo, index) => {
        $todos.insertAdjacentHTML(
          'beforeend',
          `<ul class="listcontainer ">
            <div class="checBox">
              <input type="checkbox" class="checkboxClass" id="myCheckbox">
            </div>
            <li class="list textTodo">${todo.description}</li>
            <i class="fa-solid fa-ellipsis-vertical vertical" ></i>
            <i class="fa-solid fa-trash-can delete" id="${todo.description}"></i>
          </ul>
          `,
        );

        const $removeButton = document.getElementById(`${todo.description}`);
        if ($removeButton) {
          $removeButton.addEventListener('click', () => {
            this.remove(todo.index);
          });
        }
        todo.index = index;
        todo.completed = false;
      });
    }
  }

  updateIndexes = () => {
    this.todoList.forEach((todo, index) => {
      todo.index = index;
    });
  };

  add = (description) => {
    const item = { description, index: this.todoList.length, completed: false };
    this.todoList.push(item);
    $todos.insertAdjacentHTML(
      'beforeend',
      `<ul class="listcontainer ">
        <div class="checBox">
          <input type="checkbox" class="checkboxClass" id="myCheckbox">
        </div>
        <li class="list textTodo">${item.description}</li>
        <i class="fa-solid fa-ellipsis-vertical vertical" id="edit-${item.description}" ></i>
        <i class="fa-solid fa-trash-can delete" id="${item.description}"></i>
      </ul>
      `,
    );
    localStorage.setItem('todoList', JSON.stringify(this.todoList));

    const $removeButton = document.getElementById(`${item.description}`);
    $removeButton.addEventListener('click', () => {
      const indexToRemove = this.todoList.findIndex((e) => e.description === item.description);
      if (indexToRemove > -1) {
        this.remove(indexToRemove);
        this.updateIndexes();
      }
    });
    this.updateIndexes();

    const $editButton = document.getElementById(`edit-${item.description}`);
    $editButton.addEventListener('click', () => {
      const $inputField = document.getElementById('input');
      $inputField.value = item.description;
      const $addButton = document.getElementById('addBtn');

      $addButton.addEventListener('click', () => {
        const newDescription = $inputField.value;
        const indexToEdit = this.todoList.findIndex((e) => e.description === item.description);

        if (newDescription !== '' && newDescription !== item.description) {
          if (indexToEdit > -1) {
            this.edit(indexToEdit, newDescription);
            $editButton.id = `edit-${newDescription}`;
            $editButton.textContent = newDescription;
            this.updateIndexes();
          }
        } else {
          this.remove(indexToEdit);
        }
      });
    });
  };

  edit = (indexToEdit, newDescription) => {
    const todoToEdit = this.todoList[indexToEdit];

    if (todoToEdit) {
      todoToEdit.description = newDescription;
      const $todoDescription = document.querySelector(`.textTodo[data-index="${indexToEdit}"]`);
      if ($todoDescription) {
        $todoDescription.textContent = newDescription;
        this.updateIndexes();
      }
      localStorage.setItem('todoList', JSON.stringify(this.todoList));
    }
  };

  remove = (indexToRemove) => {
    const todoToRemove = this.todoList[indexToRemove];

    if (todoToRemove) {
      const { parentElement } = document.getElementById(todoToRemove.description);
      if (parentElement) {
        parentElement.remove();
      } else {
        this.updateIndexes();
      }
      if (indexToRemove > -1) {
        this.todoList.splice(indexToRemove, 1);
        this.updateIndexes();
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
      }
      this.updateIndexes();
    }
  };
}