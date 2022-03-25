// const state = {
//   recentActivity: [],
// };

const channel = 'twitchgaming';
const parentURL = window.location.host;
const activityFeed = document.querySelector('.activityFeed');
const streamControls = document.querySelector('.streamControls');

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

// note github mentions try.donordrive but the endpoint is really testdrive.donordrive!
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
    // console.log(markup);
    // activityFeed.insertAdjacentHTML('afterbegin', markup);
    activityFeed.insertAdjacentHTML('beforeend', markup);
  });
}

// getActivity('2046');

// document.addEventListener('DOMContentLoaded', (async) => {
//   getActivity('2046');
// });

function toggleView(e) {
  const scriptDiv = document.querySelector('.videoChatScript');
  const embedContainer = document.querySelector('.embedContainer');
  const controls = document.querySelectorAll('.streamControls__option');
  const clicked = e.target.closest('.streamControls__option');
  const icon = clicked.firstElementChild;
	const videoChatMarkup = `
		<div id="twitch-embed"></div>
	`;
  const videoChatScript = `
    <script src="https://embed.twitch.tv/embed/v1.js"></script>
    <script type="text/javascript">
      new Twitch.Embed('twitch-embed', {
         width: '100%',
         height: 600,
         channel: ${channel},
       });
    </script>
  `;
  const videoMarkup = `
    <iframe
      src="https://player.twitch.tv/?channel=dallas&parent=${parentURL}/&muted=true"
      height="600"
      width="100%"
      allowfullscreen>
    </iframe> 
  `;
  const chatMarkup = `
		<iframe src="https://www.twitch.tv/embed/${channel}/chat?parent=${parentURL}/"
  	  height="600"
  	   width="100%">
		</iframe>
	`;
  const activeView = icon.id;

  const clear = () => {
    embedContainer.innerHTML = '';
    scriptDiv.innerHTML = '';
  };

  if (!clicked) return;
  if (clicked.firstElementChild.classList.contains('active')) return;

  controls.forEach((control) =>
    control.firstElementChild.classList.remove('active')
  );
  icon.classList.add('active');

  if (activeView === 'view-1') {
    clear();
    embedContainer.insertAdjacentHTML('afterbegin', videoChatMarkup);
    scriptDiv.insertAdjacentHTML('afterbegin', videoChatScript);
  }
  if (activeView === 'view-2') {
    clear();
    embedContainer.insertAdjacentHTML('afterbegin', videoMarkup);
  }
  if (activeView === 'view-3') {
    clear();
    embedContainer.insertAdjacentHTML('afterbegin', chatMarkup);
  }
}

streamControls.addEventListener('click', toggleView);
