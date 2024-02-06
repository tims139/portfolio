document.addEventListener('DOMContentLoaded', function() {
  initializeSkills();
  initializeThemeToggle();
  fetchGitHubProjects();
  initializeMessageForm();

  function initializeSkills() {
    const skills = [
      '<i class="bi bi-filetype-html"></i> HTML', 
      '<i class="bi bi-filetype-css"></i> CSS', 
      '<i class="bi bi-filetype-js"></i> JavaScript', 
      '<i class="bi bi-filetype-php"></i> PHP', 
      '<i class="bi bi-server"></i> MySQL', 
      '<i class="bi bi-r-circle"></i> React'
    ];
    const skillsContainer = document.getElementById('skills');
    const skillsList = document.createElement('ul');
    skills.forEach(skill => {
      const skillItem = document.createElement('li');
      skillItem.innerHTML = skill;
      skillItem.classList.add('badge');
      skillsList.appendChild(skillItem);
    });
    skillsContainer.appendChild(skillsList);
  }

  function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
			document.body.classList.toggle('dark-mode');
      const body = document.body;
      const themeToggleIcon = this.querySelector('i');
      if (body.classList.contains('dark-mode')) {
        themeToggleIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
      } else {
        themeToggleIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
      }
    });
  }

  function fetchGitHubProjects() {
    fetch('https://api.github.com/users/tims139/repos')
      .then(response => response.json())
      .then(data => {
        const projectsContainer = document.querySelector('.projects-container');
        projectsContainer.innerHTML = '';
        const sortedRepos = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        sortedRepos.forEach(repo => {
          const projectElement = `
            <li class="project">
              <div class="project-info">
                <h3 class="project-title"><a href="${repo.html_url}" target="_blank">${repo.name}</a> <span class="project-status complete">${repo.visibility}</span></h3>
                <p class="project-details">Created by ${repo.owner.login} on ${new Date(repo.created_at).toLocaleDateString()} · ${repo.language || 'Not specified'}</p>
              </div>
              <a class="project-view-btn" href="${repo.html_url}" target="_blank">View on <i class="bi bi-github"></i></a>
            </li>
          `;
          projectsContainer.innerHTML += projectElement;
        });
      })
      .catch(error => console.error(error));
  }

  function initializeMessageForm() {
    const form = document.getElementById('message-form');
    const messagesList = document.getElementById('messages-list');
    const messagesSection = document.getElementById('messages');

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const messageContent = document.getElementById('message').value;
      addMessage(name, email, messageContent);
      form.reset();
    });

    function addMessage(name, email, content) {
      const now = new Date();
      const formattedDate = now.toLocaleString();
      const messageElement = document.createElement('li');
      messageElement.innerHTML = `
        <div class="messages-item">
          <img src="./images/about.jpg" alt="${name}">
          <div>
            <h3><a href="mailto:${email}">${name}</a></h3>
            <p class="messages-item-date">posted on ${formattedDate}</p>
            <p>${content}</p>
            <p>
              <button class="edit-btn"><i class="bi bi-check"></i>Edit</button>
              <button class="remove-btn"><i class="bi bi-x"></i>Remove</button>
            </p>
          </div>
        </div>
      `;
      messagesList.prepend(messageElement);
      messagesSection.style.display = 'block';

      const removeBtn = messageElement.querySelector('.remove-btn');
      removeBtn.addEventListener('click', function() {
        messageElement.remove();
        if (messagesList.children.length === 0) {
          messagesSection.style.display = 'none';
        }
      });

      const editBtn = messageElement.querySelector('.edit-btn');
      editBtn.addEventListener('click', function() {
        const newName = prompt('Edit your name', name) || name;
        const newEmail = prompt('Edit your email', email) || email;
        const newContent = prompt('Edit your message', content) || content;
        messageElement.querySelector('h3 a').textContent = newName;
        messageElement.querySelector('h3 a').href = `mailto:${newEmail}`;
        messageElement.querySelectorAll('p')[1].textContent = newContent;
      });
    }

		const cancelButton = document.getElementById('cancelButton');
		cancelButton.addEventListener('click', function() {
			form.reset();
		});

  }
});