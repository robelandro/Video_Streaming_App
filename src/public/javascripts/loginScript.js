(function() {
	const resultDiv = document.getElementById('result');
	resultDiv.innerHTML = 'Login to access the site';
	// handle form login
	const handelOnLogin = () => {
		const userName = document.getElementById('userName').value;
		const password = document.getElementById('password').value;
		const data = {
			userName,
			password
		};

		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('cookie', document.cookie);
		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify(data)
		};

		fetch('/api/v1.1/users/login', options)
		.then((response) => {
			if (response.ok) {
				resultDiv.innerHTML = 'Login success';
				response.json().then((data) => {
					document.cookie = `token=${data.token};`;
				});
				location.reload();
			}
			else {
				response.json().then((data) => {
					resultDiv.innerHTML = data.message;
				});
			}
		})
		.catch((err) => {
			console.log(err);
		});
	};

    document.addEventListener('DOMContentLoaded', () => {
      const loginButton = document.getElementById('loginButton');
      loginButton.addEventListener('click', handelOnLogin);
    });

}());
