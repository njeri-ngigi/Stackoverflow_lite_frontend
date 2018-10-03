function createNode(element) {
  return document.createElement(element);
}
function append(parent, el) {
  return parent.appendChild(el);
}
function hide(elementId) {
  document.getElementById(elementId).style.display = 'none';
}
function showBlock(elementId) {
  document.getElementById(elementId).style.display = 'block';
}
function showInline(elementId) {
  document.getElementById(elementId).style.display = 'inline';
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
const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);

const uName = localStorage.getItem("username");
const divMain = document.getElementById("questions");
const token = "Bearer " + myToken;
const urlSeg = "http://localhost:5000/api/v1/";
let url = urlSeg + "questions?pages=1";
let firstCountAns = 1;

const fetchQuestions = (url) => {
  let count = 1;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      if (data.length < 1) {
        emptyHtml = `
        <div class="emptyDiv"><p>sad face emoji</p></div>
        `;
        divMain.innerHTML = emptyHtml;
        return;
      }
      return data.map((question) => {
        const addId = 'add' + count;
        const hideId = 'hide' + count;
        const answerId = 'answer' + count;
        const buttonId = 'button' + count;
        const contentId = 'content' + count;
        const spanDeleteId = 'span' + count;
        const divHtml = `
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
        qDiv.innerHTML = divHtml;
        ansDiv.setAttribute('id', answerId);
        ansDiv.classList.add('answers');
        addAnswers(question.id, ansDiv);
        append(qDiv, ansDiv);
        append(divMain, qDiv);
        if (question.username === uName) {
          showInline(spanDeleteId);
        }
        count += 1;
      })
    })
    .catch(error => console.log(error));    
}



fetchQuestions(url);

const addAnswers = (questionId, ansDiv) => {
  let secondAnsCount = 1;
  url = urlSeg + 'questions/' + questionId + '/answers';
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((answer) => {
        const acceptId = "accept" + firstCountAns + secondAnsCount; 
        const spanId = 'ansSpan' + firstCountAns + secondAnsCount;
        const editId = 'edit' + firstCountAns + secondAnsCount;
        const editInputId = 'input' + firstCountAns + secondAnsCount;
        const editButton = 'editBtn' + firstCountAns + secondAnsCount;
        const upvoteId = 'upvote' + firstCountAns + secondAnsCount;
        const downvoteId = 'downvote' + firstCountAns + secondAnsCount;
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const ansDivHtml = `
            <h4><u>@${answer.username}</u><span id=${acceptId} class="accepted" title="Accepted answer">&#10003;</span></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote" onclick="upOrDownVote('${questionId}', '${answer.id}', 'upvote', '${upvoteId}', '${downvoteId}')">&#8607;</span>
            <span id=${upvoteId}>${answer.upvotes}</span>
            <span class="votes" title="downvote" onclick="upOrDownVote('${questionId}', '${answer.id}', 'downvote','${upvoteId}', '${downvoteId}')">&#8609;</span>
            <span id=${downvoteId}>${answer.downvotes}</span>
            <span id="${spanId}" onclick="showBlock('${editId}')" class="editIcon" title="Edit answer?">&#9998;</span>
            <div class="editForm" id=${editId}>
              <textarea id=${editInputId} type="text">${answer.content}</textarea><br><br>
              <input id=${editButton} type="button" value="Update" onclick="editAnswer('${questionId}', '${answer.id}', '${editInputId}')">
              <button title="Cancel" onclick="hide('${editId}')" type="reset">X</button>
              </div>`; 
        answerDiv.innerHTML = ansDivHtml;
        append(ansDiv, answerDiv);
        if (answer.accepted) {
          showInline(acceptId);
        }
        hide(spanId);
        if (answer.username === uName) {
          showInline(spanId);
        }
        secondAnsCount += 1;
      })
    })
    .catch(error => console.log(error))
  firstCountAns += 1;
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

const upOrDownVote = (questionId, answerId, vote, up, down) => {
  url = urlSeg + "questions/"+ questionId + "/answers/" + answerId + "/" + vote;
  if (token !== undefined){
    fetch(url, {
      method: 'POST',
      headers: { 'Authorization': token }
    })
      .then(response => response.json())
      .then((data) => {
        document.getElementById(up).innerHTML = data.upvotes
        document.getElementById(down).innerHTML = data.downvotes
        showAlert(data.message);
      })
      .catch(error => console.log(error))
  }
  else {
    showAlert("Login to vote")
  }
  
}
let pageCount = 1;
const navigate = (action) => {
  let currPage = document.getElementById("curr_page");
  if (action === 'prev') {
    pageCount -= 1;
    if (pageCount < 1) {
      pageCount = 1;
      return;
    }
  }
  if (action === 'next') {
    pageCount += 1;
  }
  currPage.innerHTML = pageCount;
  divMain.innerHTML = "";
  const display = document.getElementById('most_answers').style.display
  console.log(display)
  url = urlSeg + "questions?pages=" + pageCount;
  if (display === 'block'){
    url = urlSeg + "questions?query=most_answers&pages=" + pageCount;
  }  
  fetchQuestions(url);
}

const showQs = (h3Id) => {
  if (h3Id === 'most_answers'){
    url = urlSeg + "questions?pages=1&query=most_answers";
    hide('recent');
    showBlock('most_answers')
  }
  else{
    url = urlSeg + "questions?pages=1";
    hide('most_answers');
    showBlock('recent');
  }
  document.getElementById('questions').innerHTML = ""
  fetchQuestions(url);
}

