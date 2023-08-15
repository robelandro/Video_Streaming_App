(function() {
	// Does the browser actually support the video element?
	const supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
		// Obtain handles to main elements
		const videoContainer = document.getElementById('videoContainer');
		const video = document.getElementById('video');
		const videoControls = document.getElementById('video-controls');

		// Hide the default controls
		video.controls = false;

		// Display the user defined video controls
		videoControls.setAttribute('data-state', 'visible');

		// Obtain handles to buttons and other elements
		const playpause = document.getElementById('playpause');
		const stop = document.getElementById('stop');
		const mute = document.getElementById('mute');
		const volinc = document.getElementById('volinc');
		const voldec = document.getElementById('voldec');
		const progress = document.getElementById('progress');
		const progressBar = document.getElementById('progress-bar');
		const fullscreen = document.getElementById('fs');

		// If the browser doesn't support the progress element, set its state for some different styling
		const supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

		// Check if the browser supports the Fullscreen API
		const fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);
		// If the browser doesn't support the Fulscreen API then hide the fullscreen button
		if (!fullScreenEnabled) {
			fullscreen.style.display = 'none';
		}

		// Check the volume
		const checkVolume = function(dir) {
			if (dir) {
				const currentVolume = Math.floor(video.volume * 10) / 10;
				if (dir === '+') {
					if (currentVolume < 1) video.volume += 0.1;
				} else if (dir === '-') {
					if (currentVolume > 0) video.volume -= 0.1;
				}
				// If the volume has been turned off, also set it as muted
				// Note: can only do this with the custom control set as when the 'volumechange' event is raised, there is no way to know if it was via a volume or a mute change
				if (currentVolume <= 0) video.muted = true;
				else video.muted = false;
			}
			changeButtonState('mute');
		};

		// Change the volume
		const alterVolume = function(dir) {
			checkVolume(dir);
		};

		// Set the video container's fullscreen state
		const setFullscreenData = function(state) {
			videoContainer.setAttribute('data-fullscreen', !!state);
			// Set the fullscreen button's 'data-state' which allows the correct button image to be set via CSS
			fullscreen.setAttribute('data-state', state ? 'cancel-fullscreen' : 'go-fullscreen');
		};

		// Checks if the document is currently in fullscreen mode
		const isFullScreen = function() {
			return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
		};

		// Fullscreen
		const handleFullscreen = function() {
			// If fullscreen mode is active...
			if (isFullScreen()) {
				// ...exit fullscreen mode
				// (Note: this can only be called on document)
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
				setFullscreenData(false);
			} else {
				// ...otherwise enter fullscreen mode
				// (Note: can be called on document, but here the specific element is used as it will also ensure that the element's children, e.g. the custom controls, go fullscreen also)
				if (videoContainer.requestFullscreen) videoContainer.requestFullscreen();
				else if (videoContainer.mozRequestFullScreen) videoContainer.mozRequestFullScreen();
				else if (videoContainer.webkitRequestFullScreen) {
					// Safari 5.1 only allows proper fullscreen on the video element. This also works fine on other WebKit browsers as the following CSS (set in styles.css) hides the default controls that appear again, and
					// ensures that our custom controls are visible:
					// figure[data-fullscreen=true] video::-webkit-media-controls { display:none !important; }
					// figure[data-fullscreen=true] .controls { z-index:2147483647; }
					video.webkitRequestFullScreen();
				} else if (videoContainer.msRequestFullscreen) videoContainer.msRequestFullscreen();
				setFullscreenData(true);
			}
		};

		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', () => {
				progress.setAttribute('max', video.duration);
			});

			// Changes the button state of certain button's so the correct visuals can be displayed with CSS
			var changeButtonState = function(type) {
				// Play/Pause button
				if (type == 'playpause') {
					if (video.paused || video.ended) {
						playpause.setAttribute('data-state', 'play');
					} else {
						playpause.setAttribute('data-state', 'pause');
					}
				}
				// Mute button
				else if (type == 'mute') {
					mute.setAttribute('data-state', video.muted ? 'unmute' : 'mute');
				}
			};

			// Add event listeners for video specific events
			video.addEventListener('play', () => {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('pause', () => {
				changeButtonState('playpause');
			}, false);
			video.addEventListener('volumechange', () => {
				checkVolume();
			}, false);

			// Add events for all buttons
			playpause.addEventListener('click', (e) => {
				if (video.paused || video.ended) video.play();
				else video.pause();
			});

			// The Media API has no 'stop()' function, so pause the video and reset its time and the progress bar
			stop.addEventListener('click', (e) => {
				video.pause();
				video.currentTime = 0;
				progress.value = 0;
				// Update the play/pause button's 'data-state' which allows the correct button image to be set via CSS
				changeButtonState('playpause');
			});
			mute.addEventListener('click', (e) => {
				video.muted = !video.muted;
				changeButtonState('mute');
			});
			volinc.addEventListener('click', (e) => {
				alterVolume('+');
			});
			voldec.addEventListener('click', (e) => {
				alterVolume('-');
			});
			fs.addEventListener('click', (e) => {
				handleFullscreen();
			});

			// As the video is playing, update the progress bar
			video.addEventListener('timeupdate', () => {
				// For mobile browsers, ensure that the progress element's max attribute is set
				if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
				progress.value = video.currentTime;
				progressBar.style.width = `${Math.floor((video.currentTime / video.duration) * 100)}%`;
			});

			// React to the user clicking within the progress bar
			progress.addEventListener('click', function(e) {
				// var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth; // Also need to take the parent into account here as .controls now has position:relative
				const pos = (e.pageX - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = pos * video.duration;
			});

			// Listen for fullscreen change events (from other controls, e.g. right clicking on the video itself)
			document.addEventListener('fullscreenchange', (e) => {
				setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
			});
			document.addEventListener('webkitfullscreenchange', () => {
				setFullscreenData(!!document.webkitIsFullScreen);
			});
			document.addEventListener('mozfullscreenchange', () => {
				setFullscreenData(!!document.mozFullScreen);
			});
			document.addEventListener('msfullscreenchange', () => {
				setFullscreenData(!!document.msFullscreenElement);
			});

			// handle upload file
			function handleFileUpload() {

				const input = document.createElement('input');
				input.type = 'file';
				input.accept = 'video/mp4'; // Only allow MP4 video files, you can change this if needed
				input.addEventListener('change', (event) => {
					const file = event.target.files[0];
					if (file) {
						// Make a POST request to the /videoUpload endpoint
						const header = new Headers();
						const loading = document.createElement('progress');
						loading.id = 'loading';
						const storedVideo = document.getElementById('storedVideo');
						storedVideo.appendChild(loading);
						header.append('Content-Type', 'video/mp4');
						header.append('Content-Length', file.size);
						header.append('Content-Name', file.name);
						header.append('Cookie', document.cookie);
						const options = {
							method: 'POST',
							headers: header,
							body: file,
						};
						fetch('/api/v1.1/videos/upload', options)
							.then((res) => {
								if (res.ok) {
									// If the upload is successful, update the list of videos
									updatePopulateVideoList();
									// Remove the loading bar
									storedVideo.removeChild(loading);
									alert('Upload complete');
								} else {
									alert('Upload failed');
									storedVideo.removeChild(loading);
								}
							}).catch((err) => {
								console.log(err);
								alert(err);
								storedVideo.removeChild(loading);
							});
					}
				});

				// Trigger the file selection dialog
				input.click();
			}

			// Function the send log out request
			function handleLogout() {
				fetch('/api/v1.1/users/logout', {
						method: 'PUT'
					})
					.then((res) => {
						if (res.ok) {
							location.reload();
						} else {
							alert('Logout failed');
						}
					})
					.catch((err) => {
						console.log(err);
						alert(err);
					});
			}

			// Function to create a clickable button with the provided video data
			function createListItem(videoData, id) {
				function formatBytes(bytes, decimals = 2) {
					if (isNaN(bytes)) return 'Invalid input'; // Check if bytes is a valid number

					const k = 1024; // Base unit
					const dm = decimals < 0 ? 0 : decimals; // Check if decimals is valid
					const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; // Size units
					const i = Math.floor(Math.log(bytes) / Math.log(k)); // Index of the unit

					return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`; // Formatted string
				}
				const listItem = document.createElement('li');
				const button = document.createElement('button');
				const deketeButton = document.createElement('button');
				listItem.id = 'listItem';
				button.id = 'itemButton';
				deketeButton.id = 'deleteButton';
				deketeButton.textContent = 'Delete';
				button.textContent = `${videoData.fileName} - ${videoData.uploadDate} ${formatBytes(videoData.fileSize)}`;
				button.addEventListener('click', () => {
					// When the button is clicked, play the video
					video.src = `/api/v1.1/videos/${id}`;
					video.load();
					video.play();
					// Update the currently selected video info
					const videoInfoDiv = document.getElementById('video-info');
					videoInfoDiv.innerHTML = '';
					const videoInfo = document.createElement('p');
					videoInfo.id = 'videoInfo';
					videoInfo.textContent = `Currently playing: ${videoData.fileName} - ${videoData.date}`;
					videoInfoDiv.appendChild(videoInfo);
				});
				deketeButton.addEventListener('click', () => {
					// When the button is clicked, Delete the video
					const header = new Headers();
					header.append('Cookie', document.cookie);
					header.append('Content-Type', 'application/json');
					const options = {
						method: 'DELETE',
						headers: header,
					};
					fetch(`/api/v1.1/videos/${id}`, options)
						.then((response) => {
							if (response.ok) {
								// If the Delete is successful, update the list of videos
								updatePopulateVideoList();
								alert('Delete complete');
							} else {
								alert('Delete failed');
							}
						})
						.catch((error) => console.log('Error fetching video list:', error));
				});
				listItem.appendChild(button);
				listItem.appendChild(deketeButton);
				return listItem;
			}

			// Function to fetch the video data and populate the list
			function populateVideoList() {
				const header = new Headers();
				header.append('Cookie', document.cookie);
				const options = {
					method: 'GET',
					headers: header,
				};
				fetch('/api/v1.1/videos', options)
					.then((response) => response.json())
					.then((data) => {
						data = data.data.videos;
						const listElement = document.getElementById('list');
						for (const key in data) {
							if (Object.prototype.hasOwnProperty.call(data, key)) {
								const listItem = createListItem(data[key], data[key]._id);
								listElement.appendChild(listItem);
							}
						}
					})
					.catch((error) => console.log('Error fetching video list:', error));
			}

			// Function to update the list when a new video is uploaded
			function updatePopulateVideoList() {
				const listElement = document.getElementById('list');
				listElement.innerHTML = '';
				populateVideoList();
			}

			// handle upload button
			document.addEventListener('DOMContentLoaded', () => {
				const uploadButton = document.getElementById('upload');
				const logoutButton = document.getElementById('logout');
				uploadButton.addEventListener('click', handleFileUpload);
				logoutButton.addEventListener('click', handleLogout);
				populateVideoList();
			});
		}
	}
}());
