"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export interface Todo {
  _id?: string;
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

  useEffect(() => {
    fetch('/api/v1/todo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      setTodos(data.data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
    });
  }, []);

  // Create: Add new todo item
  const addTodo = () => {
    if (newTitle.trim() === "" || newDueDate.trim() === "") return;
    fetch('/api/v1/todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        completed: false,
        dueDate: newDueDate,
      })
    }).then(res => res.json()).then(data => {
      setTodos([
        ...todos,
        {
          _id: data.data._id,
          title: newTitle,
          description: newDescription,
          completed: false,
          dueDate: newDueDate,
        },
      ]);
      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
    });
  };

  // Update: Toggle completed status
  const toggleTodo = (id: string) => {
    fetch('/api/v1/todo', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: todos.find(x => x._id == id)!._id,
        completed: todos.find(x => x._id == id)!.completed
      })
    }).then(res => res.json()).then(data => {
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    })
  };

  const removeTodo = (id: string) => {
    fetch('/api/v1/todo', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: todos.find(x => x._id == id)!._id
      })
    }).then(res => res.json()).then(data => {
      const newTodos = [...todos];
      newTodos.splice(todos.findIndex(x => x._id == id), 1);
      setTodos(newTodos);
    })

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
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`${styles.todoItem} ${todo.completed ? styles.completed : ""
              }`}
          >
            <div>
              <span
                onClick={() => toggleTodo(todo._id!)}
                className={styles.todoTitle}
              >
                {todo.title}
              </span>
              <p className={styles.todoDescription}>{todo.description}</p>
              <span className={styles.dueDate}>กำหนดวันที่ต้องทำ: {todo.dueDate}</span>
            </div>
            <div className="flex justify-center gap-2">
              <button
                className={`${styles.toggleButton} bg-blue-600`}
                onClick={() => toggleTodo(todo._id!)}
              >
                {todo.completed ? "ยังไม่เสร็จ" : "เสร็จแล้ว"}
              </button>
              <button
                className={`${styles.toggleButton} bg-red-600`}
                onClick={() => removeTodo(todo._id!)}
              >
                ลบ
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;

