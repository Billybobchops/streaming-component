const state = {};
const parentURL = window.location.host;
const activityFeed = document.querySelector('.activityFeed');
const streamControls = document.querySelector('.streamControls');
const mobileIcon = document.querySelector('.mobileIcon');
const modalOverlay = document.querySelector('.modalOverlay');
const cancelBtn = document.querySelector('.cancelBtn');

async function getParticipantData(particpantId) {
  try {
    const res = await fetch(
      `https://testdrive.donordrive.com/api/1.3/participants/${particpantId}`
    );
    if (!res.ok)
      throw new Error('There was an error fetching donation page url.');

    const data = await res.json();
    const donationURL = data.links.donate;
    const displayName = data.displayName;
    const markup = `
			<span>${displayName}</span>
		`;
    document
      .querySelector('.streamHeader__title')
      .insertAdjacentHTML('afterbegin', markup);
    console.log(
      `For participant ID: ${particpantId} their donate page link is: ${donationURL}`
    );
    return donationURL;
  } catch (error) {
    console.log(error);
  }
}

async function getActivity(particpantId) {
  try {
    const headers = {};
    const etag = localStorage.getItem('etag');
    if (etag) headers['If-None-Match'] = JSON.parse(etag);
    console.log(headers);

    const res = await fetch(
      `https://testdrive.donordrive.com/api/1.3/participants/${particpantId}/activity?limit=3&orderBy=createdDateUTC%20DESC`,
      {
        method: 'GET',
        headers,
      }
    );
    if (!res.ok) throw new Error('There was an error fetching activity data.');

    // data not modified, render cached data from state
    if (res.status === 304) {
      console.log(res.status);
      renderActivities(state.activities);
      return;
    }

    // data has been modified, render new response
    if (res.status === 200) {
      console.log(res.status);
      const activityData = await res.json();
      state['activities'] = activityData;
      localStorage.setItem('etag', res.headers.get('etag'));
      renderActivities(activityData);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function convertUTCDate(ISO8601DateString) {
  const activityDate = new Date(ISO8601DateString);
  const today = new Date();
  const timeDiff = today - activityDate;
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
  const activityTime = `${activityDate
    .toLocaleTimeString()
    .slice(0, 4)} ${activityDate.toLocaleTimeString().slice(-2)}`;
  const currentTime = `${today.toLocaleTimeString().slice(0, 5)} ${today
    .toLocaleTimeString()
    .slice(-2)}`;
  let timeString;

  if (daysDiff > 1) timeString = `${daysDiff} days`; // if it is not today
  if (daysDiff === 1 && activityTime !== currentTime) timeString = activityTime; // if it is today
  if (activityTime === currentTime) timeString = 'Just Now'; // if it is exactly the current time

  return timeString;
}

function renderActivities(activities) {
  // will need functionality to clear out UI of existing elements if new data is recieved~

  activities.forEach((a) => {
    const title = a.title ? a.title : 'Anonymous';
    const message = a.message ? `"${a.message}"` : '';
    const timeString = convertUTCDate(a.createdDateUTC);

    const markup = `
    <div class="activityFeed__item">
      <div class="feature">$${a.amount}</div>
      <div class="content">
        <p class="title">${title}</p>
        <p class="quotation">${message}</p>
      </div>
      <div class="time">${timeString}</div>
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
  const clicked = e.target.closest('.streamControls__option');
  const id = clicked.id;

  if (!clicked) return;
  if (clicked.firstElementChild.classList.contains('active')) return;
  if (clicked.firstElementChild.classList.contains('cancelBtn')) {
    closeModalMenu();
    return;
  }

  controls.forEach((control) =>
    control.firstElementChild.classList.remove('active')
  );
  clicked.firstElementChild.classList.add('active');

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
document.addEventListener('keydown', escapeClose);

// document.addEventListener('DOMContentLoaded', (async) => {
//   getActivity('2046');
// });

getActivity('2046');
getParticipantData('2046');
