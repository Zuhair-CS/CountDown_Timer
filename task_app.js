window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const hoursInput = document.querySelector("#task-hours");
	const minutesInput = document.querySelector("#task-minutes");
	const secondsInput = document.querySelector("#task-seconds");
	const list_el = document.querySelector("#tasks");

	document.addEventListener('mousemove', e=>{
		const cursor = document.querySelector('.cursor');
		cursor.style.left = e.pageX + 'px';
		cursor.style.top = e.pageY + 'px';
	});
	// Load cached tasks from localStorage
	const loadCachedTasks = () => {
		const cachedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
		cachedTasks.forEach(task => renderTask(task.description, task.hours, task.minutes, task.seconds));
	};

	// Save tasks to localStorage
	const saveTasksToCache = () => {
		const tasks = Array.from(document.querySelectorAll('.task')).map(task => ({
			description: task.querySelector('.text').value,
			hours: task.querySelectorAll('.time-input')[0].value,
			minutes: task.querySelectorAll('.time-input')[1].value,
			seconds: task.querySelectorAll('.time-input')[2].value,
		}));
		localStorage.setItem('tasks', JSON.stringify(tasks));
	};

	// Render a task on the page
	const renderTask = (description, hours, minutes, seconds) => {
		// Create the task container
		const task_el = document.createElement('div');
		task_el.classList.add('task');

		// Create the content container
		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');
		task_el.appendChild(task_content_el);

		// Add task description
		const task_desc_el = document.createElement('input');
		task_desc_el.classList.add('text');
		task_desc_el.type = 'text';
		task_desc_el.value = description;
		task_desc_el.setAttribute('readonly', 'readonly');
		task_content_el.appendChild(task_desc_el);

		// Add timer fields
		[["Hours", hours], ["Minutes", minutes], ["Seconds", seconds]].forEach(([label, value]) => {
			const time_input = document.createElement('input');
			time_input.classList.add('time-input');
			time_input.type = 'number';
			time_input.value = value;
			time_input.setAttribute('readonly', 'readonly');
			task_content_el.appendChild(time_input);
		});

		// Create action buttons (Edit, Delete)
		const task_actions_el = document.createElement('div');
		task_actions_el.classList.add('actions');

		const task_edit_el = document.createElement('button');
		task_edit_el.classList.add('edit');
		task_edit_el.innerText = 'Edit';

		const task_delete_el = document.createElement('button');
		task_delete_el.classList.add('delete');
		task_delete_el.innerText = 'Delete';

		task_actions_el.appendChild(task_edit_el);
		task_actions_el.appendChild(task_delete_el);
		task_el.appendChild(task_actions_el);
		list_el.appendChild(task_el);

		// Attach listeners to the new task
		attachTaskClickListeners(task_el);
		attachActionListeners(task_el);

		saveTasksToCache(); // Save tasks after rendering
	};

	// Redirects to Timer.html and stores current timer values in localStorage
	window.RedirectToPage = function () {
		const hours = document.querySelector('.inp-hours').value;
		const minutes = document.querySelector('.inp-minutes').value;
		const seconds = document.querySelector('.inp-seconds').value;

		// Store values in localStorage
		localStorage.setItem('hours', hours);
		localStorage.setItem('minutes', minutes);
		localStorage.setItem('seconds', seconds);
		window.location.href = "Timer.html";
	};

	// Attach event listeners for a task
	const attachTaskClickListeners = (task) => {
		task.addEventListener('click', () => {
			if (task.querySelector(".edit")?.innerText.toLowerCase() === "save") return;

			const hours = task.querySelectorAll('.time-input')[0].value;
			const minutes = task.querySelectorAll('.time-input')[1].value;
			const seconds = task.querySelectorAll('.time-input')[2].value;

			document.querySelector('.inp-hours').value = hours;
			document.querySelector('.inp-minutes').value = minutes;
			document.querySelector('.inp-seconds').value = seconds;
		});
	};

	// Attach edit and delete functionality to a task
	const attachActionListeners = (task) => {
		const editButton = task.querySelector(".edit");
		const deleteButton = task.querySelector(".delete");
		const task_desc_el = task.querySelector('.text');
		const time_inputs = task.querySelectorAll('.time-input');

		editButton?.addEventListener('click', () => {
			if (editButton.innerText.toLowerCase() === "edit") {
				editButton.innerText = "Save";
				[task_desc_el, ...time_inputs].forEach(input => input.removeAttribute("readonly"));
			} else {
				editButton.innerText = "Edit";
				[task_desc_el, ...time_inputs].forEach(input => input.setAttribute("readonly", "readonly"));
				saveTasksToCache(); // Save tasks when editing is done
			}
		});

		deleteButton?.addEventListener('click', () => {
			list_el.removeChild(task);
			saveTasksToCache(); // Save tasks after deletion
		});
	};

	// Form submission to add a new task
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const task = input.value.trim();
		const hours = hoursInput.value || "0";
		const minutes = minutesInput.value || "0";
		const seconds = secondsInput.value || "0";

		if (!task) {
			alert("Task description cannot be empty!");
			return;
		}

		renderTask(task, hours, minutes, seconds);

		input.value = '';
		hoursInput.value = '';
		minutesInput.value = '';
		secondsInput.value = '';
	});

	// Load cached tasks on page load
	loadCachedTasks();
});
