function createNode(element) {
  return document.createElement(element);
}
function append(parent, el) {
  return parent.appendChild(el);
}
function hide(el) {
  document.getElementById(el).style.display = 'none';
}
function showBlock(el) {
  document.getElementById(el).style.display = 'block';
}
function showInline(el) {
  document.getElementById(el).style.display = 'inline';
}
const showHideAns = (hideId, answersGiven) => {
  if (answersGiven > 0) {
    showInline(hideId);
  }
}
const myToken = localStorage.getItem('token');
if (myToken === undefined || myToken === null || myToken === '') {
  hide('profileH3');
  showBlock('loginH3');
} 

const reload = () => window.location.reload();

const uName = localStorage.getItem('username')

const divMain = document.getElementById('questions');

const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);

const token = "Bearer " + myToken;

const fetchQuestions = (url) => {
  let count = 1;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((question) => {
        const addId = 'add' + count;
        const hideId = 'hide' + count;
        const answerId = 'answer' + count;
        const buttonId = 'button' + count;
        const contentId = 'content' + count;
        const spanDeleteId = 'span' + count;
        const h = `
            <h2><u>${question.title}</u></h2>
            <h5>asked by ${question.username}</h5>
            <p>${question.content}</p>
            <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showHideAns('${hideId}', '${question.answers_given}')"> forum </i> 
            <span>${question.answers_given}</span>
            <span class="add" title="Answer this question" onclick="showBlock('${addId}')">&#xff0b;</span>
            <span id=${spanDeleteId} class="delete" title="Delete answer?" onclick="deleteQst('${question.id}')">&#9986;</span>
            <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
            <div class="add_comment_card" id="${addId}">
                <input id=${contentId} type="text" placeholder="Answer this question ..."><br><br>
                <input id=${buttonId} type="button" value="Add" onclick="postAnswer('${question.id}', '${contentId}', '${addId}')">
                <button title="Cancel" onclick="hide('${addId}')" type="reset">X</button>
            </div>`;
        const qDiv = createNode('div');
        const ansDiv = createNode('div');
        qDiv.classList.add('question_card');
        qDiv.innerHTML = h;
        ansDiv.setAttribute('id', answerId);
        ansDiv.classList.add('answers');
        addAnswers(question.id, ansDiv);
        append(qDiv, ansDiv);
        append(divMain, qDiv);
        if (question.username === uName) {
          showInline(spanDeleteId);
        }
        ++count;
      })
    })
    .catch(error => console.log(error));    
}

const urlSeg = "http://localhost:5000/api/v1/";
let url = urlSeg + "questions?pages=1";

fetchQuestions(url);

const addAnswers = (questionId, ansDiv) => {
  let countAns = 1;
  url = urlSeg + 'questions/' + questionId + '/answers';
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((answer) => {
        const spanId = 'ansSpan' + countAns;
        const editId = 'edit' + countAns;
        const editInputId = 'input' + countAns;
        const editButton = 'editBtn' + countAns;
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const c = `
            <h4><u>@${answer.username}</u><span title="Accepted answer" class="accepted">&#10003;</span></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote">&#8607;</span>
            <span>${answer.upvotes}</span>
            <span class="votes" title="downvote">&#8609;</span>
            <span>${answer.downvotes}</span>
            <span id="${spanId}" onclick="showBlock('${editId}')" class="editIcon" title="Edit answer?">&#9998;</span>
            <div class="editForm" id=${editId}>
              <textarea id=${editInputId} type="text">${answer.content}</textarea><br><br>
              <input id=${editButton} type="button" value="Update" onclick="editAnswer('${questionId}', '${answer.id}', '${editInputId}')">
              <button title="Cancel" onclick="hide('${editId}')" type="reset">X</button>
              </div>`; 
        answerDiv.innerHTML = c;
        append(ansDiv, answerDiv);
        hide(spanId);
        if (answer.username === uName) {
          showInline(spanId);
        }
        ++countAns;
      })
    })
}

const postQuestions = (divId) => {
  const title = getEl('titleQst');
  const content = getEl('contentQst');
  url = urlSeg + 'questions/';
  const data = {
    title: title,
    content: content
  }
  postStuff(url, data, divId);
}

const postAnswer = (questionId, contentId, divId) => {
  const content = getEl(contentId);
  const data = {
    content: content
  };
  url = urlSeg + 'questions/' + questionId + '/answers';
  postStuff(url, data, divId);
};
let status = '';

const postStuff = (myUrl, data, divId) => {
  fetch(myUrl, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: token,
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

const logout = () => {
  url = urlSeg + 'auth/logout';

  fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: token,
    }
  })
  .then((response) => {
      status = response.status;
      return response.json();
  })
  .then((data) => {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.replace('./index.html');
      if (status !== 200) {
        showAlert(data.msg);
      }
      else{
        showAlert(data.message);
      }      
  })
  .catch(error => console.log(error))
}

const editAnswer = (questionId, answerId, editInputId) => {
  const content = getEl(editInputId)
  console.log(content)
  url = urlSeg + 'questions/' + questionId + '/answers/' + answerId;
  fetch(url, {
      method: 'PUT',
      headers:{
        Authorization: token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content:content })
  })
  .then(response => response.json())
  .then((data) => {
      showAlert(data.message)
      reload();
    })
}

const deleteQst = (qid) => {
  const res = confirm("Are you sure you want to delete this question?");
  if (res === true){
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
}
