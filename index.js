/**
 * 生成唯一uuid
 * @example
 * // returns '6b09e9c0-d100-414a-b68c-99886a6efd78'
 * guid()
 * @return {string} - uuid
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 顶部添加任务模块
 * @param props
 * @param {function} props.todoAdd - 添加任务
 */
const AddTodo = ({todoAdd}) => {
  // 添加任务
  const addTodo = (event) => {
    // 判断用户敲击的是否是回车键
    if (event.key === 'Enter') {
      // 获取用户在文本框中输入的内容
      const taskName = event.target.value;
      // 判断用户在文本框中是否输入了内容
      if (taskName.trim().length === 0) {
        // 阻止程序向下执行
        return;
      }
      // 将任务添加到任务列表数组中
      todoAdd(taskName);
      // 清空文本框中的内容
      event.target.value = '';
    }
  };
  return React.createElement(
      'header',
      {className: 'header'},
      React.createElement('h1', {}, 'todos'),
      React.createElement('input', {
        className: 'new-todo',
        placeholder: 'What needs to be done?',
        onKeyUp: addTodo,
      }),
  );
};

/**
 * 中间任务列表模块
 * @param props
 * @param {{id: string, taskName: string, isCompleted: boolean}[]} props.filterTodos - 过滤过的todo-list
 * @param {function} props.todoDelete - 删除任务
 * @param {function} props.changeCompleted - 修改任务状态
 */
const TodoList = ({filterTodos = [], todoDelete, changeCompleted}) => {
  return React.createElement(
      'section',
      {className: 'main'},
      React.createElement('input', {
        className: 'toggle-all',
        type: 'checkbox',
      }),
      React.createElement(
          'ul',
          {className: 'todo-list'},
          filterTodos.map((todo, index) => {
            return React.createElement(
                'li',
                {
                  className: todo.isCompleted ? 'completed' : '',
                  key: todo.id,
                },
                React.createElement(
                    'div',
                    {className: 'view'},
                    React.createElement('input', {
                      className: 'toggle',
                      type: 'checkbox',
                      checked: todo.isCompleted,
                      onChange: (event) => changeCompleted(index,
                          event.target.checked),
                    }),
                    React.createElement('label', {}, todo.taskName),
                    React.createElement('button', {
                      className: 'destroy',
                      onClick: () => todoDelete(index),
                    }),
                ),
                React.createElement('input', {className: 'edit'}),
            );
          }),
      ),
  );
};

/**
 * 底部额外模块
 * @param props
 * @param {'All' | 'Active' | 'Completed'} props.filter - 筛选条件
 * @param {number} props.unfinishedTodoCount - 未完成任务数量
 * @param {function} props.changeFilter
 * @param {function} props.clearCompleted - 删除已完成的任务
 */
const TodoExtra = ({
  filter,
  unfinishedTodoCount,
  changeFilter,
  clearCompleted,
}) => {
  return React.createElement(
      'footer',
      {className: 'footer'},
      React.createElement(
          'span',
          {className: 'todo-count'},
          React.createElement('strong', {}, unfinishedTodoCount),
          ' item left',
      ),
      React.createElement(
          'ul',
          {className: 'filters'},
          ['All', 'Active', 'Completed'].map((status) =>
              React.createElement(
                  'li',
                  {key: status},
                  React.createElement(
                      'button',
                      {
                        className: filter === status ? 'selected' : '',
                        onClick: () => changeFilter(status),
                      },
                      status,
                  ),
              ),
          ),
      ),
      React.createElement(
          'button',
          {
            className: 'clear-completed',
            onClick: clearCompleted,
          },
          'Clear completed',
      ),
  );
};

const App = () => {
  /* 原始任务列表 */
  const [todos, setTodos] = React.useState([]);
  /* 根据原始任务列表过滤后的列表 */
  const [filterTodos, setFilterTodos] = React.useState([]);
  /* 筛选条件 */
  const [filter, setFilter] = React.useState('All');

  /* 根据筛选条件过滤列表 */
  React.useEffect(() => {
    switch (filter) {
      case 'All':
        return setFilterTodos(todos);
      case 'Active':
        return setFilterTodos(
            todos.filter((todo) => todo.isCompleted === false),
        );
      case 'Completed':
        return setFilterTodos(
            todos.filter((todo) => todo.isCompleted === true),
        );
    }
  }, [filter, todos]);

  /**
   * 添加任务
   * @param {string} taskName - 任务名称
   */
  const todoAdd = (taskName) => {
    setTodos([...todos, {taskName, isCompleted: false, id: guid()}]);
  };

  /**
   * 删除任务
   * @param {number} index - 待删除任务所在索引
   */
  const todoDelete = (index) => {
    const result = [...todos];
    result.splice(index, 1);
    setTodos(result);
  };

  /**
   * 更改任务的是否已完成状态
   * @param {number} index - 任务所在索引
   * @param {boolean} flag - 任务状态
   */
  const changeCompleted = (index, flag) => {
    const result = [...todos];
    setTodos(
        result.map((todo, idx) =>
            idx === index ? {...todo, isCompleted: flag} : todo,
        ),
    );
  };

  /**
   * 更改筛选条件
   * @param {'All' | 'Active' | 'Completed'} condition - 筛选条件
   */
  const changeFilter = (condition) => {
    setFilter(condition);
  };

  /* 清除已完成的任务 */
  const clearCompleted = () => {
    setTodos([...todos].filter(todo => !todo.isCompleted));
  };

  return React.createElement(
      'section',
      {className: 'todoapp'},
      React.createElement(AddTodo, {todoAdd}),
      React.createElement(TodoList, {filterTodos, todoDelete, changeCompleted}),
      React.createElement(
          TodoExtra,
          {
            changeFilter, filter,
            unfinishedTodoCount: todos.filter(todo => !todo.isCompleted).length,
            clearCompleted,
          },
      ),
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('app'));
