window.addEventListener('load', () => {
	const form = document.querySelector("#new-task-form");
	const input = document.querySelector("#new-task-input");
	const list_el = document.querySelector("#tasks");

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		const task = input.value;

		// Create the task container
		const task_el = document.createElement('div');
		task_el.classList.add('task');

		// Create the content container
		const task_content_el = document.createElement('div');
		task_content_el.classList.add('content');
		task_el.appendChild(task_content_el);

		// Create input fields for task description, hours, minutes, seconds
		const task_desc_el = document.createElement('input');
		task_desc_el.classList.add('text');
		task_desc_el.type = 'text';
		task_desc_el.value = task;
		task_desc_el.setAttribute('readonly', 'readonly');
		task_content_el.appendChild(task_desc_el);

		['hours', 'minutes', 'seconds'].forEach((type) => {
			const time_input = document.createElement('input');
			time_input.classList.add('time-input');
			time_input.type = 'number';
			time_input.value = type === 'minutes' ? '2' : '0'; // Default to 2 for minutes as an example
			time_input.min = 0;
			time_input.placeholder = type.charAt(0).toUpperCase() + type.slice(1);
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

		// Clear the input field
		input.value = '';

		// Edit button functionality
		task_edit_el.addEventListener('click', () => {
			if (task_edit_el.innerText.toLowerCase() === "edit") {
				task_edit_el.innerText = "Save";
				[task_desc_el, ...task_content_el.querySelectorAll('.time-input')].forEach(input => input.removeAttribute("readonly"));
			} else {
				task_edit_el.innerText = "Edit";
				[task_desc_el, ...task_content_el.querySelectorAll('.time-input')].forEach(input => input.setAttribute("readonly", "readonly"));
			}
		});

		// Delete button functionality
		task_delete_el.addEventListener('click', () => {
			list_el.removeChild(task_el);
		});
	});
});
