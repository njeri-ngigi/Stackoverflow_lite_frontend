const createNode = element => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const hide = elementId => document.getElementById(elementId).style.display = 'none';
const showBlock = elementId => document.getElementById(elementId).style.display = 'block';
const showInline = elementId => document.getElementById(elementId).style.display = 'inline';
const reload = () => window.location.reload();
const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);
const showHideAns = (hideId, answersGiven) => {
  if (answersGiven > 0) {
    showInline(hideId);
  }
}
const addError = (data, errorId) => {
  const errorDiv = document.getElementById(errorId);
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = data.message;
}

const myToken = localStorage.getItem('token');
if (myToken === undefined || myToken === null || myToken === '') {
  hide('profileH3');
  hide('postQ');
  showBlock('loginH3');
} 

const uName = localStorage.getItem("username");
const divMain = document.getElementById("questions");
const token = "Bearer " + myToken;
const urlSeg = "https://my-stackoverflow-lite-api.herokuapp.com/api/v1/";
let url = urlSeg + "questions?pages=1";
let firstCountAns = 1;
let status = '';
let pageCount = 1;

const helper = (pageCount) => {
  const display = document.getElementById('most_answers').style.display
  url = urlSeg + "questions?pages=" + pageCount;
  if (display === 'block'){
    url = urlSeg + "questions?query=most_answers&pages=" + pageCount;
  }  
  return url;
}

const fetchNext = () => {
  const next = pageCount + 1;
  url = helper(next);
  fetch(url)
  .then(resp => resp.json())
  .then((data)=>{
    if (data.length < 1){
      hide('next_page')
    }
  })
};

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
        const contentId = 'content' + firstCountAns + secondAnsCount;
        const errorId = 'editError' + firstCountAns + secondAnsCount;
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const ansDivHtml = `
            <h4><u>@${answer.username}</u><span id=${acceptId} class="accepted" title="Accepted answer">&#10003;</span></h4>
            <p id=${contentId}>${answer.content}</p>
            <span class="votes" title="upvote" onclick="upOrDownVote('${questionId}', '${answer.id}', 'upvote', '${upvoteId}', '${downvoteId}')">&#8607;</span>
            <span id=${upvoteId}>${answer.upvotes}</span>
            <span class="votes" title="downvote" onclick="upOrDownVote('${questionId}', '${answer.id}', 'downvote','${upvoteId}', '${downvoteId}')">&#8609;</span>
            <span id=${downvoteId}>${answer.downvotes}</span>
            <span id="${spanId}" onclick="showBlock('${editId}')" class="editIcon" title="Edit answer?">&#9998;</span>
            <div class="editForm" id=${editId}>
              <textarea id=${editInputId} type="text" placeholder="Enter content...">${answer.content}</textarea><br><br>
              <input id=${editButton} type="button" value="Update" onclick="editAnswer('${questionId}', '${answer.id}', '${editInputId}', '${contentId}', '${editId}', '${errorId}')">
              <button title="Cancel" onclick="hide('${editId}')" type="reset">X</button>
              <div class="error" id=${errorId}></div>
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

const fetchQuestions = (url) => {
  let count = 1;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      divMain.innerHTML = '';
      return data.map((question) => {
        const qId = 'question' + count;
        const addId = 'add' + count;
        const hideId = 'hide' + count;
        const answerId = 'answer' + count;
        const buttonId = 'button' + count;
        const contentId = 'content' + count;
        const spanDeleteId = 'span' + count;
        const errorId = 'error' + count;
        const divHtml = `
            <h2><u>${question.title}</u></h2>
            <h5>asked by ${question.username}</h5>
            <p>${question.content}</p>
            <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showHideAns('${hideId}', '${question.answers_given}')"> forum </i> 
            <span>${question.answers_given}</span>
            <span class="add" title="Answer this question" onclick="showBlock('${addId}')">&#xff0b;</span>
            <span id=${spanDeleteId} class="delete" title="Delete answer?" onclick="deleteQst('${question.id}', '${qId}')">&#9986;</span>
            <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
            <div class="add_comment_card" id="${addId}">
                <input id=${contentId} type="text" placeholder="Answer this question ..."><br><br>
                <input id=${buttonId} type="button" value="Add" onclick="postAnswer('${question.id}', '${contentId}', '${addId}', '${errorId}')">
                <button title="Cancel" onclick="hide('${addId}')" type="reset">X</button>
                <div class="error" id=${errorId}></div>
            </div>`;
        const qDiv = createNode('div');
        const ansDiv = createNode('div');
        qDiv.classList.add('question_card');
        qDiv.setAttribute('id', qId);
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
fetchNext();

const postQuestions = (divId) => {
  const title = getEl('titleQst');
  const content = getEl('contentQst');
  url = urlSeg + 'questions/';
  const data = {
    title: title,
    content: content
  }
  postStuff(url, data, divId, 'qst');
}

const postAnswer = (questionId, contentId, divId, errorId) => {
  const content = getEl(contentId);
  const data = {
    content: content
  };
  url = urlSeg + 'questions/' + questionId + '/answers';
  postStuff(url, data, divId, 'ans', errorId);
};

const postStuff = (myUrl, data, divId, action, errorId='') => {
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
      if (status === 201) {
        hide(divId);
        reload();
      }
      else{
        if (action === 'qst') {
          const errorDiv = document.getElementById('q_error');
          errorDiv.style.display = 'block';
          errorDiv.innerHTML = data.message;
        }
        if (action === 'ans') {
          addError(data, errorId)
        }
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
const editAnswer = (questionId, answerId, editInputId, divId, editFormId, errorId) => {
  const content = getEl(editInputId)
  url = urlSeg + 'questions/' + questionId + '/answers/' + answerId;
  fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: content })
  })
    .then((response) => {
      status = response.status;
      return response.json();
    })
    .then((data) => {
      if (status === 200) {
        document.getElementById(divId).innerHTML = content;
        hide(editFormId);
      }
      else{
        addError(data, errorId);
      }
    })
    .catch(error => console.log(error))
}

const deleteQst = (qid, divId) => {
  const res = confirm("Are you sure you want to delete this question?");
  if (res === true){
      url = urlSeg + 'questions/' + qid;  
  fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  })
    .then(response => response.json())
    .then((data) => {
      const child = document.getElementById(divId);
      divMain.removeChild(child);
      fetchNext();
    })
    .catch(error => console.log(error))
  }   
}

const upOrDownVote = (questionId, answerId, vote, up, down) => {
  url = urlSeg + "questions/"+ questionId + "/answers/" + answerId + "/" + vote;
  if (token !== undefined){
    fetch(url, {
      method: 'POST',
      headers: { 'Authorization': token }
    })
      .then((response) => {
        status = response.status
        return response.json()
      })
      .then((data) => {
        if (status === 200) {
        document.getElementById(up).innerHTML = data.upvotes
        document.getElementById(down).innerHTML = data.downvotes
        }
        else {
          showAlert(data.message);
        }
        
      })
      .catch(error => console.log(error))
  }
  else {
    showAlert("Login to vote")
  }
}

const navigate = (action) => {
  let currPage = document.getElementById("curr_page");
  if (action === 'prev') {
    showInline('next_page')
    pageCount -= 1;
    if (pageCount < 1) {
      pageCount = 1;
    }
    if (pageCount === 1) {
      hide('prev_page');
    }
  }
  if (action === 'next') {
    showInline('prev_page')
    pageCount += 1;
  }
  currPage.innerHTML = pageCount;
  url = helper(pageCount)
  
  fetchQuestions(url);
  fetchNext();
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



