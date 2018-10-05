const display = (divId) => {
  document.getElementById('buttons').style.display = 'none';
  if (divId === 'signup') {
    document.getElementById('login').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
  }
  if (divId === 'login') {
    document.getElementById('login').style.display = 'block';
    document.getElementById('signup').style.display = 'none';
  }
};
const el = id => document.getElementById(id)
const getEl = id => el(id).value;
const showAlert = message => setTimeout(function() { alert(message); }, 30);

let status = '';
const login = (username, password) => {
  let url = 'http://localhost:5000/api/v1/auth/login';
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password })
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        console.log("Heyyo!")
        window.location.replace('./home.html');
        let token = data.token;
        if (typeof (Storage) !== 'undefined') {
          localStorage.setItem("token", token);
          localStorage.setItem('username', username);
        } else {
          showAlert('Sorry! No web storage support..');
        }
      }
      else {
        divError = el('login_error');
        divError.style.display = "block";
        divError.innerHTML = data.message;
      }
    })
    .catch(error => console.log(error))
};

const signup = () => {
  let name = getEl('name');
  let username = getEl('username');
  let email = getEl('email');
  let password = getEl('password');
  let confirmPassword = getEl('confirm_password');
  let url = 'http://localhost:5000/api/v1/auth/signup';
  let myData = {
    name: name, 
    username: username, 
    email: email, 
    password: password, 
    confirm_password: confirmPassword }
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(myData)
  })
    .then((response) => {
      status = response.status
      return response.json()
    })
    .then((data) => {
      if (status === 201) {
        login(username, password);
      }
      else {
        divError = el('signup_error');
        divError.style.display = "block";
        divError.innerHTML = data.message;
      }
    })
    .catch(error => console.log(error));
}
const defineLogin = () => {
  let username = getEl('loginUsername');
  let password = getEl('loginPassword');
  login(username, password);
}
