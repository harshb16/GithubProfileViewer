const API = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser(username) {
  try {
    const response = await fetch(API + username);
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.message == '404') {
      createErrorCard('No profile with this username');
    }
  }
}

async function getRepos(username) {
  try {
    const response = await fetch(API + username + '/repos?sort=created');
    if (!response.ok) throw new Error(response.status);
    const data = await response.json();

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}

function createUserCard(user) {
  if (Object.keys(user).length === 0) {
    main.innerHTML = '';
    return;
  }

  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : '';
  const cardHTML = `
    <div class="card">
    <div>
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
    </div>
    <div class="user-info">
      <h2>${userID} 
        <a href="${user.html_url}" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub logo" width="20" height="20">
        </a>
      </h2>
      ${userBio}
      <ul>
        <li>&nbsp;${user.followers}<strong>Followers&nbsp;&nbsp;</strong></li>
        <li>&nbsp;${user.following}<strong>Following&nbsp;&nbsp;</strong></li>
        <li>&nbsp;${user.public_repos}<strong>Repos&nbsp;&nbsp;</strong></li>
      </ul>

      <div id="repos"></div>
    </div>
  </div>
    `;
  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposList = document.getElementById('repos-list');
  reposList.innerHTML = '';

  repos.forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    if (repo.fork) {
      const forkedEl = document.createElement('span');
      forkedEl.innerText = ' (Forked)';
      repoEl.appendChild(forkedEl);
    }

    reposList.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});
