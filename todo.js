
function logout() {
    // Clear user data from local storage
    localStorage.removeItem('userForm');
    // Redirect to login page
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    var openMenu = document.getElementById('menu');
        const openPopupBtn = document.getElementById('openPopupBtn');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const popup = document.getElementById('popup');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const incompleteTasksList = document.getElementById('incomplete-tasks-list');
    var sidebar = document.querySelector('.sidebar');

    // Check if the menu button exists
    if (openMenu) {
        // Add click event listener to the menu button
        openMenu.addEventListener('click', function () {
            // Toggle the visibility of the sidebar
            if (sidebar.style.display === 'none') {
                sidebar.style.display = 'block';
            } else {
                sidebar.style.display = 'none';
            }
        });
    }
    


    openPopupBtn.addEventListener('click', function () {
        popup.classList.add('active');
    });

    closePopupBtn.addEventListener('click', function () {
        popup.classList.remove('active');
    });

    // Load existing tasks from localStorage
    let existingTasks = JSON.parse(localStorage.getItem('newTask')) || [];
    renderTodoList(existingTasks);

    // Submit form
    document.getElementById('formData').addEventListener('submit', function (event) {
        event.preventDefault();
        const summary = document.getElementById('summary').value.trim();
        const description = document.getElementById('description').value.trim();
        const date = document.getElementById('date').value.trim();

        if (summary === '') return; // Do not add empty tasks

        const newTask = {
            'summary': summary,
            'description': description,
            'date': date
        };

        existingTasks.push(newTask);
        localStorage.setItem('newTask', JSON.stringify(existingTasks));

        renderTodoList(existingTasks);
        scheduleNotification(newTask); // Schedule notification for the new task
        document.getElementById('formData').reset();
        popup.classList.remove('active');
    });

    function renderTodoList(tasks) {
        completedTasksList.innerHTML = '';
        incompleteTasksList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.classList.add('todo-item');

            const taskDate = new Date(task.date);
            const currentDate = new Date();
            
            if (taskDate < currentDate) {
                li.innerHTML = ` <img src="images/check.png" id="checkbox"> ${task.summary} `
                completedTasksList.appendChild(li);
            } else {
                li.innerHTML = `<img src="images/uncheck.png" id="checkbox">   ${task.summary} <br>  
                <img src="images/clock.png" id="img">  ${task.date}`;
                incompleteTasksList.appendChild(li);
                scheduleNotification(task); // Schedule notification for each incomplete task
            }
        });
    }

    function scheduleNotification(task) {
        const taskDate = new Date(task.date);
        const timeUntilDue = taskDate.getTime() - Date.now();
        if (timeUntilDue > 0) {
            setTimeout(() => {
                showNotification(task.summary, task.description);
            }, timeUntilDue);
        }
    }

    function showNotification(title, body) {
        // Check if the browser supports notifications
        if (!("Notification" in window)) {
            console.log("This browser does not support system notifications");
            return;
        }

        // Check if permission to display notifications has been granted
        if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            new Notification(title, { body: body });
        } else if (Notification.permission !== "denied") {
            // Otherwise, we need to ask the user for permission
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    new Notification(title, { body: body });
                }
            });
        }
    }
});

function toggleSidebar() {
    var sidebar = document.querySelector('.sidbar');
    sidebar.classList.toggle('active');
}

