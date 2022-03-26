// const state = {
//   recentActivity: [],
// };

const channel = 'twitchgaming';
const parentURL = window.location.host;
const activityFeed = document.querySelector('.activityFeed');
const streamControls = document.querySelector('.streamControls');
const mobileIcon = document.querySelector('.mobileIcon');
const modalOverlay = document.querySelector('.modalOverlay');
const cancelBtn = document.querySelector('.cancelBtn');

async function getDonationPageURL(particpantId) {
  try {
    const res = await fetch(
      `https://testdrive.donordrive.com/api/1.3/participants/${particpantId}`
    );
    if (!res.ok)
      throw new Error('There was an error fetching donation page url.');
    const data = await res.json();
    const donationURL = data.links.donate;
    return donationURL;
  } catch (error) {
    console.log(error);
  }
}

// note to self: github docs mention try.donordrive but the endpoint is really testdrive.donordrive!
async function getActivity(particpantId) {
  try {
    const res = await fetch(
      `https://testdrive.donordrive.com/api/1.3/participants/${particpantId}/activity?limit=3&orderBy=createdDateUTC%20DESC`
    );
    if (!res.ok) throw new Error('There was an error fetching activity data.');
    const activities = await res.json();
    // activities.forEach((a) => state.recentActivity.push(a));
    // console.log(`the state is now..`);
    // console.log(state);
    console.log(activities);
    renderActivities(activities);
  } catch (error) {
    console.log(error);
  }
}

function renderActivities(activities) {
  activities.forEach((a) => {
    const title = a.title ? a.title : 'Anonymous';
    const message = a.message ? `"${a.message}"` : '';

    console.log(`${a.createdDateUTC}`);
    console.log(Date.UTC(a.createdDateUTC));
    // a.createdDateUTC.toString()

    const markup = `
    <div class="activityFeed__item">
      <div class="feature">$${a.amount}</div>
      <div class="content">
        <p class="title">${title}</p>
        <p class="quotation">${message}</p>
      </div>
      <div class="time">11:11AM</div>
    </div>`;
    activityFeed.insertAdjacentHTML('beforeend', markup);
  });
}

function closeModalMenu() {
  modalOverlay.classList.add('hidden');
  streamControls.classList.remove('activeMenu');
}

function showMenu() {
  modalOverlay.classList.remove('hidden');
  streamControls.classList.add('activeMenu');
}

function escapeClose(e) {
  if (e.key === 'Escape') {
    console.log('escape key pressed');
    closeModalMenu();
  }
}

function toggleView(e) {
  const embed = document.querySelector('.embed');
  const videoFrame = document.getElementById('video');
  const chatFrame = document.getElementById('chat');
  const controls = document.querySelectorAll('.streamControls__option');
  // const clicked = e.target;
  const clicked = e.target.closest('.streamControls__option');
  // const id = clicked.closest('.streamControls__option').id;
  const id = clicked.id;

  console.log('clicked is');
  console.log(clicked);

  if (!clicked) return;
  if (clicked.firstElementChild.classList.contains('active')) return;
  if (clicked.firstElementChild.classList.contains('cancelBtn')) {
    closeModalMenu();
		return;
  }

  controls.forEach((control) =>
    control.firstElementChild.classList.remove('active')
  );
  clicked.firstElementChild.classList.add('active'); // need to add conditional logic to this to handle <div> and <p>

  if (id === 'view-1') {
    embed.classList.remove('embedGridOne');
    embed.classList.add('embedGridBoth');
    videoFrame.classList.remove('hidden');
    chatFrame.classList.remove('hidden');
    closeModalMenu();
  }
  if (id === 'view-2') {
    embed.classList.remove('embedGridBoth');
    embed.classList.add('embedGridOne');
    videoFrame.classList.remove('hidden');
    chatFrame.classList.add('hidden');
    closeModalMenu();
  }
  if (id === 'view-3') {
    embed.classList.remove('embedGridBoth');
    embed.classList.add('embedGridOne');
    chatFrame.classList.remove('hidden');
    videoFrame.classList.add('hidden');
    closeModalMenu();
  }
}

streamControls.addEventListener('click', toggleView);
modalOverlay.addEventListener('click', closeModalMenu);
mobileIcon.addEventListener('click', showMenu);
// cancelBtn.addEventListener('click', closeModalMenu);
document.addEventListener('keydown', escapeClose);

// document.addEventListener('DOMContentLoaded', (async) => {
//   getActivity('2046');
// });

// getActivity('2046');

// && streamControls.classList.contains('activeMenu')
