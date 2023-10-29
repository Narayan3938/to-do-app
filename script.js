document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const errorMessage = document.getElementById("error-message");
    const taskList = document.getElementById("taskList");
    const showOptions = document.getElementById("show-options");
  
    // Event Listeners
    addTaskButton.addEventListener("click", addTask);
    showOptions.addEventListener("change", filterTodos);
  
    // Add an event listener to the taskInput field for input changes
    // To reset the error message
    taskInput.addEventListener("input", () => {
      const taskText = taskInput.value.trim();
      if (taskText.length >= 2) {
        taskInput.isError = false;
        errorMessage.textContent = "";
        taskInput.style.borderColor = "";
        return;
      }
    });
  
    loadTasks();
  
    function filterTodos() {
      const selectedOption = showOptions.value;
      if (selectedOption === "active") {
        showActiveTasks();
      } else if (selectedOption === "completed") {
        showCompletedTasks();
      } else {
        showAllTasks();
      }
    }
  
    function addTask() {
      const taskText = taskInput.value.trim();
      if (taskText === "") {
        alert("Task cannot be empty!");
        taskInput.isError = true;
        return;
      }
      if (taskText.length < 2) {
        errorMessage.textContent = `Task is too short (minimum 2 characters is needed).`;
        taskInput.style.borderColor = "red";
        return;
      }
  
      if (taskInput.isError) {
        taskInput.isError = false;
      }
  
      const task = {
        text: taskText,
        completed: false
      };
      // Check if task already exists to prevent duplicate with same name
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const isExistsWithSameName = tasks.some(
        (t) => t.text.toLowerCase() === taskText.toLowerCase()
      );
      if (isExistsWithSameName) {
        alert("Task exists already!");
        return;
      }
  
      // Save task and clear the error message if exists
      saveTask(task);
      taskInput.value = "";
      errorMessage.textContent = "";
      taskInput.style.borderColor = "";
      loadTasks();
    }
  
    function saveTask(task) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      tasks.push(task);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    function loadTasks() {
      taskList.innerHTML = "";
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
      for (const task of tasks) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                  <span class="${task.completed ? "completed" : ""}">${
          task.text
        }</span>
        <div>
          <button class="mark-done small">Mark Done</button>
          <button class="remove-task small">
            Delete
          </button>
        </div>
              `;
        taskList.appendChild(listItem);
  
        // Show total tasks item count
        const todoCountElement = document.getElementById("todo-count");
        todoCountElement.innerHTML = tasks.length;
  
        const markDoneButton = listItem.querySelector(".mark-done");
        markDoneButton.addEventListener("click", () => markTaskDone(task));
  
        const removeTaskButton = listItem.querySelector(".remove-task");
        removeTaskButton.addEventListener("click", () => removeTask(task));
      }
    }
  
    function markTaskDone(task) {
      const availableTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = [];
  
      for (i = 0; i < availableTasks.length; i++) {
        if (availableTasks[i].text === task.text) {
          availableTasks[i].completed = !task.completed;
        }
        updatedTasks.push(availableTasks[i]);
      }
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      loadTasks();
    }
  
    function removeTask(task) {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const updatedTasks = tasks.filter((t) => t.text !== task.text);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      loadTasks();
    }
  
    function showAllTasks() {
      loadTasks();
    }
  
    function showActiveTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const activeTasks = tasks.filter((t) => !t.completed);
      displayFilteredTasks(activeTasks);
    }
  
    function showCompletedTasks() {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      const completedTasks = tasks.filter((t) => t.completed);
      displayFilteredTasks(completedTasks);
    }
  
    function displayFilteredTasks(filteredTasks) {
      taskList.innerHTML = "";
      for (const task of filteredTasks) {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                  <span class="${task.completed ? "completed" : ""}">${
          task.text
        }</span>
                  <div>
                    <button class="mark-done small">Mark Done</button>
                    <button class="remove-task small">
                      Delete
                    </button>
                  </div>
              `;
        taskList.appendChild(listItem);
  
        const markDoneButton = listItem.querySelector(".mark-done");
        markDoneButton.addEventListener("click", () => markTaskDone(task));
  
        const removeTaskButton = listItem.querySelector(".remove-task");
        removeTaskButton.addEventListener("click", () => removeTask(task));
      }
    }
  });