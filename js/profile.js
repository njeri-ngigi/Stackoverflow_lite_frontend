function showPostQuestion(divId) {
  if (divId === 'postQuestion') {
    document.getElementById('postQuestion').style.display = 'block';
    document.getElementById('profileDetails').style.display = 'none';
  }
  if (divId === 'profileDetails') {
    document.getElementById('postQuestion').style.display = 'none';
    document.getElementById('profileDetails').style.display = 'block';
  }  
}

function showQuestionCards(divId) {
  if (divId === 'userQuestions') {
    document.getElementById('userQuestions').style.display = 'block';
    document.getElementById('userAnswers').style.display = 'none';
  }
  if (divId === 'userAnswers') {
    document.getElementById('userQuestions').style.display = 'none';
    document.getElementById('userAnswers').style.display = 'block';
  }
}
const reload = () => window.location.reload();

function createNode(element) {
  return document.createElement(element);
}
function append(parent, el) {
  return parent.appendChild(el);
}
function hide(el) {
  document.getElementById(el).style.display = "none";
}
function showBlock(el) {
  document.getElementById(el).style.display = "block";
}
function showInline(el) {
  document.getElementById(el).style.display = "inline";
}

// document.getElementById('username').innerHTML = localStorage.getItem('username');

const divUserQuestions = document.getElementById('userQuestions');
const divUserAnswers = document.getElementById('userAnswers');
const urlSeg = "http://localhost:5000/api/v1/";
let url = urlSeg + 'users/questions';
let count = 1;

const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);

let token = localStorage.getItem('token');
token = "Bearer " + token;

fetch(url, {
  method: 'GET',
  headers: { Authorization: token }
})
  .then(response => response.json())
  .then((data) => {
    const qst = data.length;
    document.getElementById('question_count').innerHTML = qst;
    return data.map((question) => {
      const hideId = 'hide' + count;
      const answerId = 'answer' + count;
      const qid = question.question_id;
      const html = `
          <h2><u>${question.title}</u></h2>
          <p>${question.content}</p>
          <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showInline('${hideId}')"> forum </i> 
          <span>${question.answers}</span>
          <span id=${qid} onclick="deleteQst('${qid}')" class="delete" title="Delete question?">&#9986;</span>
          <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
      `;
      const userQDiv = createNode('div');
      const userAnsDiv = createNode('div');
      userQDiv.classList.add('question_card');
      userQDiv.setAttribute('id', 'first_question');
      userQDiv.innerHTML = html;
      userAnsDiv.setAttribute('id', answerId);
      userAnsDiv.classList.add('answers');
      addAnswers(qid, userAnsDiv);
      append(userQDiv, userAnsDiv);
      append(divUserQuestions, userQDiv);
      ++count;
    })
  })
  .catch(error => console.log(error));

const addAnswers = (questionId, ansDiv) => {
  url = urlSeg + 'questions/' + questionId + '/answers';
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((answer) => {
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const span = createNode('span');
        const c = `
            <h4><u>@${answer.username}</u></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote">&#8607;</span>
            <span>${answer.upvotes}</span>
            <span class="votes" title="downvote">&#8609;</span>
            <span>${answer.downvotes}</span>`;
        span.innerHTML = '&#10003;';
        span.setAttribute('title', 'Accept answer?');
        span.classList.add('accept')
        if (answer.accepted) {
          span.setAttribute('id', 'accepted_answer');
        }
        answerDiv.innerHTML = c;
        append(answerDiv, span);
        append(ansDiv, answerDiv);
      })
    })
    .catch(error => console.log(error));
};

const deleteQst = (qid) => {
  url = urlSeg + 'questions/' + qid;  
  fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  })
    .then(response => response.json())
    .then((data) => {
      showAlert(data.message);
      reload();
      // reload screen
    }).catch(error => console.log(error))
}

const postQuestions = (divId) => {
  const title = getEl('qTitle');
  const content = getEl('qContent');
  url = urlSeg + 'questions/';
  const data = {
    title: title,
    content: content
  }
  postStuff(url, data, divId);
}

const postStuff = (myUrl, data, divId) => {
  token = localStorage.getItem('token');
  token = "Bearer " + token;
  fetch(myUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(data)
  })
    .then((response) =>{
      status = response.status;
      return response.json();
    })
    .then((data) => {
      showAlert(data.message);
      if (status === 201) {
        hide(divId);
        reload();
      }
    })
    .catch(error => console.log(error))
};
