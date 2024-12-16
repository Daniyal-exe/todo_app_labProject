export class ClassManager {
    constructor(contentDiv) {
        this.contentDiv = contentDiv;
        this.classes = new Map();
    }

    async addClass(className) {
        if (!this.classes.has(className)) {
            this.classes.set(className, []);
            await this.loadTodos(className);
        }
    }

    async loadTodos(className) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User not logged in');
            }

            const response = await fetch(`http://localhost:3002/todos/${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const todos = await response.json();
            const classTodos = todos.filter(todo => todo.class_name === className);
            this.classes.set(className, classTodos);
            this.showClassContent(className);
        } catch (error) {
            console.error('Error loading todos:', error);
            alert('Error loading todos: ' + error.message);
        }
    }

    async addTodoItem(className, text) {
    try {
        const userId = localStorage.getItem('userId');
        console.log('Attempting to add todo with:', { userId, className, text }); // Add this line

        if (!userId) {
            throw new Error('User not logged in');
        }

        const response = await fetch('http://localhost:3002/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                className: className,
                todoText: text
            }),
        });

        // Add this block to log the response
        const responseText = await response.text();
        console.log('Server response:', responseText);
        
        if (!response.ok) {
            throw new Error(responseText || 'Failed to add todo');
        }

        const data = JSON.parse(responseText);
        if (data.message === "Todo created successfully") {
            await this.loadTodos(className);
        }
    } catch (error) {
        console.error('Error adding todo:', error);
        alert('Failed to add todo: ' + error.message);
    }
}

showClassContent(className) {
    this.contentDiv.innerHTML = '';
    const todos = this.classes.get(className) || [];

    const ul = document.createElement('ul');
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.todo_text;
        li.dataset.todoId = todo.id;

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="ri-delete-bin-line"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => this.deleteTodoItem(todo.id, className);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="ri-edit-line"></i>';
        editBtn.className = 'edit-btn';
        editBtn.onclick = () => {
            this.openEditModal(todo.todo_text, todo.id, className);
        };

        li.appendChild(deleteBtn);
        li.appendChild(editBtn);
        ul.appendChild(li);
    });

    this.contentDiv.appendChild(ul);
}



openEditModal(currentText, todoId, className, callback) {
    const modal = document.getElementById('edit-modal');
    const editInput = document.getElementById('edit-input');
    const saveButton = document.getElementById('save-edit');
    const cancelButton = document.getElementById('cancel-edit');

    editInput.value = currentText;
    modal.style.display = 'block';

    const closeModal = () => {
        modal.style.display = 'none';
    };

    saveButton.onclick = () => {
        const newText = editInput.value.trim();
        if (newText) {
            this.updateTodoItem(todoId, className, newText)
                .then(() => {
                    closeModal();
                    if (callback) callback(newText);
                })
                .catch((error) => {
                    console.error('Error saving updated todo:', error);
                });
        } else {
            alert('Todo cannot be empty!');
        }
    };

    cancelButton.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
}

    async deleteTodoItem(todoId, className) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User not logged in');
            }
    
            const response = await fetch(`http://localhost:3002/todos/${todoId}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
    
            // Remove the todo locally after successful deletion
            const classTodos = this.classes.get(className) || [];
            this.classes.set(className, classTodos.filter(todo => todo.id !== todoId));
    
            // Refresh the UI
            this.showClassContent(className);
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('Failed to delete todo: ' + error.message);
        }
    }

    
    async updateTodoItem(todoId, className, newText) {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                throw new Error('User not logged in');
            }
    
            const response = await fetch(`http://localhost:3002/todos/${todoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    className: className,
                    todoText: newText
                }),
            });
    
            const responseText = await response.text();
            console.log('Server response:', responseText); // Debugging log
    
            if (!response.ok) {
                throw new Error(responseText || 'Failed to update todo');
            }
    
            const data = JSON.parse(responseText);
            if (data.message === "Todo updated successfully") {
                await this.loadTodos(className); // Reload todos to update the UI
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('Failed to update todo: ' + error.message);
        }
    }
    
    

    
}
