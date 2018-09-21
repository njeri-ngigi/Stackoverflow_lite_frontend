function display(divId) {
  document.getElementById('signupButton').addEventListener('submit', signup);
  document.getElementById('loginButton').addEventListener('submit', defineLogin);
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
const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function() { alert(message); }, 300);

let status = '';
function login(username, password) {
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
      console.log(data);
      console.log(username, password);
      showAlert(data.message);
      console.log(status)
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
    })
    .catch(error => console.log(error))
};

function signup() {
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
    .then(response => response.json())
    .then((data) => {
      showAlert(data.message);
      if (data.status === 201) {
        login(username, password);
      }
    })
    .catch(error => console.log(error));
}
function defineLogin() {
  let username = getEl('loginUsername');
  let password = getEl('loginPassword');
  
  login(username, password);
}
