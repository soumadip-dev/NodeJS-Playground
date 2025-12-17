import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_TODOS_WITH_USER = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      completed
      user {
        id
        name
      }
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_TODOS_WITH_USER);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Something went wrong</h2>
        <p className="error-message">{error.message}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Todo List</h1>
        <p className="app-subtitle">
          Total: {data.getTodos.length} {data.getTodos.length === 1 ? 'todo' : 'todos'}
        </p>
      </header>

      <main className="todos-container">
        {data.getTodos.map(todo => (
          <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : 'pending'}`}>
            <div className="todo-header">
              <div className="todo-title-wrapper">
                <h3 className="todo-title">{todo.title}</h3>
                <span
                  className={`status-badge ${todo.completed ? 'completed-badge' : 'pending-badge'}`}
                >
                  {todo.completed ? '✓ Completed' : '⏳ Pending'}
                </span>
              </div>
            </div>

            <div className="todo-user-info">
              <div className="user-avatar">
                <span className="avatar-text">{todo.user.name.charAt(0)}</span>
              </div>
              <div className="user-details">
                <p className="user-name">
                  <span className="label">Assigned to:</span> {todo.user.name}
                </p>
                <p className="user-id">
                  <span className="label">User ID:</span> {todo.user.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          Showing {data.getTodos.length} todos •
          {data.getTodos.filter(todo => todo.completed).length} completed •
          {data.getTodos.filter(todo => !todo.completed).length} pending
        </p>
      </footer>
    </div>
  );
};

export default App;
