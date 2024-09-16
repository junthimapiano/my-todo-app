"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  // Create: Add new todo item
  const addTodo = () => {
    if (newTitle.trim() === "" || newDueDate.trim() === "") return;
    setTodos([
      ...todos,
      {
        id: Date.now(),
        title: newTitle,
        description: newDescription,
        completed: false,
        dueDate: newDueDate,
      },
    ]);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  // Update: Toggle completed status
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Read: Display all todos in a list
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Todo List</h1>

      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="ชื่องาน"
        />
        <input
          className={styles.input}
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="รายละเอียดงาน"
        />
        <input
          className={styles.dateInput}
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <button className={styles.addButton} onClick={addTodo}>
          สร้างงาน
        </button>
      </div>

      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.todoItem} ${
              todo.completed ? styles.completed : ""
            }`}
          >
            <div>
              <span
                onClick={() => toggleTodo(todo.id)}
                className={styles.todoTitle}
              >
                {todo.title}
              </span>
              <p className={styles.todoDescription}>{todo.description}</p>
              <span className={styles.dueDate}>กำหนดวันที่ต้องทำ: {todo.dueDate}</span>
            </div>
            <button
              className={styles.toggleButton}
              onClick={() => toggleTodo(todo.id)}
            >
              {todo.completed ? "ยังไม่เสร็จ" : "เสร็จแล้ว"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
