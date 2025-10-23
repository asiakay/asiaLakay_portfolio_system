async function loadProjects() {
  const container = document.querySelector('#projects');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('./data/projects.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const projects = await response.json();
    const fragment = document.createDocumentFragment();

    projects.forEach((project) => {
      const card = document.createElement('article');
      card.className = 'card';

      const title = document.createElement('h3');
      title.textContent = project.title;

      const summary = document.createElement('p');
      summary.textContent = project.summary;

      const stack = document.createElement('p');
      const stackLabel = document.createElement('strong');
      stackLabel.textContent = 'Stack: ';
      stack.appendChild(stackLabel);
      stack.append(document.createTextNode(project.stack.join(', ')));

      const link = document.createElement('a');
      link.href = project.link;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Learn more';

      card.append(title, summary, stack, link);
      fragment.appendChild(card);
    });

    container.appendChild(fragment);
  } catch (error) {
    console.error(error);
    container.textContent = 'Unable to load portfolio data right now.';
  }
}

loadProjects();
