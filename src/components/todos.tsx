'use client'

import React, { useState } from 'react'
import { useMachine } from '@xstate/react'
import { todosMachine } from '@/machines/todos-machine'

export const Todos = () => {
  const [state, send] = useMachine(todosMachine)
  const { todos, todo, filter } = state.context

  const [editingId, setEditingId] = useState<string | null>(null)

  const filteredTodos = todos.filter((item) => {
    if (filter === 'active') return !item.completed
    if (filter === 'completed') return item.completed
    return true
  })

  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Todo App</h1>
        <input
          type="text"
          value={todo}
          onChange={(e) => send({ type: 'newTodo.change', value: e.target.value })}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              send({ type: 'newTodo.commit', value: todo })
            }
          }}
          placeholder="What needs to be done?"
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          aria-label="New todo input"
        />
        <ul className="mb-4" role="list" aria-label="Todo list">
          {filteredTodos.map((item) => (
            <li key={item.id} className="flex items-center mb-3 bg-gray-50 rounded-md p-2 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center flex-grow min-w-0">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() =>
                    send({
                      type: 'todo.mark',
                      id: item.id,
                      mark: item.completed ? 'active' : 'completed',
                    })
                  }
                  className="mr-3 w-5 h-5 flex-shrink-0 text-blue-600"
                  aria-label={`Mark "${item.title}" as ${item.completed ? 'active' : 'completed'}`}
                />
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      send({
                        type: 'todo.commit',
                        todo: { ...item, title: e.target.value },
                      })
                    }
                    onBlur={() => setEditingId(null)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        setEditingId(null)
                      }
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                    autoFocus
                    aria-label={`Edit todo "${item.title}"`}
                  />
                ) : (
                  <span
                    onDoubleClick={() => setEditingId(item.id)}
                    className={`block w-full truncate text-lg ${
                      item.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}
                  >
                    {item.title}
                  </span>
                )}
              </div>
              <button
                onClick={() => send({ type: 'todo.delete', id: item.id })}
                className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl flex-shrink-0"
                aria-label={`Delete todo "${item.title}"`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 mt-4">
          <span className="mb-2 sm:mb-0">{activeTodos.length} items left</span>
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              onClick={() => send({ type: 'filter.change', filter: 'all' })}
              className={`px-3 py-1 rounded-md ${
                filter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={filter === 'all'}
            >
              All
            </button>
            <button
              onClick={() => send({ type: 'filter.change', filter: 'active' })}
              className={`px-3 py-1 rounded-md ${
                filter === 'active'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={filter === 'active'}
            >
              Active
            </button>
            <button
              onClick={() => send({ type: 'filter.change', filter: 'completed' })}
              className={`px-3 py-1 rounded-md ${
                filter === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              aria-pressed={filter === 'completed'}
            >
              Completed
            </button>
          </div>
          {completedTodos.length > 0 && (
            <button
              onClick={() => send({ type: 'todos.clearCompleted' })}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>
    </div>
  )
}