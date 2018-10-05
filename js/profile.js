const profileDetailsDiv = document.getElementById('profileDetails')

const active = (elAdd, elRemove) => {
  document.getElementById(elAdd).classList.add('lightOrange');
  document.getElementById(elRemove).classList.remove('lightOrange');
}

const showQuestionCards = (divId) => {
  if (divId === 'userQuestions') {
    document.getElementById('userQuestions').style.display = 'block';
    document.getElementById('userAnswers').style.display = 'none';
    active('Q_left', 'Q_right');
  }
  if (divId === 'userAnswers') {
    document.getElementById('userQuestions').style.display = 'none';
    document.getElementById('userAnswers').style.display = 'block';
    active('Q_right', 'Q_left');
  }
}

const addError = (data, errorId) => {
  const errorDiv = document.getElementById(errorId);
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = data.message;
}
const reload = () => window.location.reload();
const createNode = element => document.createElement(element);
const append = (parent, el) => parent.appendChild(el);
const hide = el => document.getElementById(el).style.display = "none";
const showBlock = el => document.getElementById(el).style.display = "block";
const showInline = el => document.getElementById(el).style.display = "inline";

const username = localStorage.getItem('username');
document.getElementById('username').innerHTML = `@${username}`;

const divUserQuestions = document.getElementById('userQuestions');
const divUserAnswers = document.getElementById('userAnswers');
const questionCount = document.getElementById('question_count');
const urlSeg = "http://localhost:5000/api/v1/";
let url = urlSeg + 'users/questions';
let count = 1;

const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);
const showHideAns = (hideId, answersGiven) => {
  if (answersGiven > 0) {
    showInline(hideId);
  }
}
let token = localStorage.getItem('token');
token = "Bearer " + token;
let statu = ''

// fetch user questions
fetch(url, {
  method: 'GET',
  headers: { Authorization: token }
})
  .then(response => response.json())
  .then((data) => {
    const qst = data.length;
    questionCount.innerHTML = qst;
    return data.map((question) => {
      const aDivId = 'aDiv' + count;
      const hideId = 'hide' + count;
      const answerId = 'answer' + count;
      const qid = question.question_id;
      const html = `
          <h2><u>${question.title}</u></h2>
          <p>${question.content}</p>
          <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showHideAns('${hideId}', '${question.answers}')"> forum </i> 
          <span>${question.answers}</span>
          <span id=${qid} onclick="deleteQst('${qid}', '${aDivId}')" class="delete" title="Delete question?">&#9986;</span>
          <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
      `;
      const userQDiv = createNode('div');
      const userAnsDiv = createNode('div');
      userQDiv.classList.add('question_card');
      userQDiv.setAttribute('id', aDivId);
      if (count === 1) {
        userQDiv.setAttribute('id', 'first_question');
      }
      userQDiv.innerHTML = html;
      userAnsDiv.setAttribute('id', answerId);
      userAnsDiv.classList.add('answers');
      addAnswers(qid, answerId);
      append(userQDiv, userAnsDiv);
      append(divUserQuestions, userQDiv);
      count += 1;
    })
  })
  .catch(error => console.log(error));

// fetch user answers
let count2 = 1;
url = urlSeg + 'users/answers';
fetch(url, {
  method: 'GET',
  headers: { Authorization: token }
})
  .then(response => response.json())
  .then((data) => {
    document.getElementById('answer_count').innerHTML = data.count;
    const answers = data.answers;
    return answers.map((question) => {
      const hideId = 'hide2' + count2;
      const answerId = 'answer2' + count2;
      const html = `
          <h2><u>${question.title}</u></h2>
          <h5>asked by ${question.username}</h5>
          <p>${question.content}</p>
          <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showHideAns('${hideId}', '${question.answers_count}')"> forum </i> 
          <span>${question.answers_count}</span>
          <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
      `;
      const userQDiv = createNode('div');
      const userAnsDiv = createNode('div');
      userQDiv.classList.add('question_card');
      if (count2 === 1) {
        userQDiv.setAttribute('id', 'first_answer');
      }

      userQDiv.innerHTML = html;
      userAnsDiv.setAttribute('id', answerId);
      userAnsDiv.classList.add('answers');
      append(userQDiv, userAnsDiv);
      append(divUserAnswers, userQDiv);
      // add answers
      const allAnswers = question.answers;
      let count21 = 1;
      allAnswers.map((answer) => {
        const errorId = 'error' + count21;
        const contentId = 'content' + count21;
        const editSpanId = 'editSpan' + count21;
        const editFormId = 'editForm' + count21;
        const editInputId = 'editInput' + count21;
        const editButtonId = 'editButton' + count21;
        const acceptedId = 'accepted' + count21;
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const ansDivHtml = `
              <h4><u>@${answer.username}</u><span title="Accepted answer" class="accept accepted_answer" id="${acceptedId}">&#10003;</span></h4>
              <p id=${contentId}>${answer.content}</p>
              <span class="votes" title="upvotes">&#8607;</span>
              <span>${answer.upvotes}</span>
              <span class="votes" title="downvotes">&#8609;</span>
              <span>${answer.downvotes}</span>
              <span id="${editSpanId}" onclick="showBlock('${editFormId}')" class="editIcon" title="Edit answer?">&#9998;</span>
              <div class="editForm" id=${editFormId}>
                <textarea id=${editInputId} type="text" placeholder="Enter content...">${answer.content}</textarea><br><br>
                <input id=${editButtonId} type="button" value="Update" onclick="editAnswer('${question.id}', '${answer.id}', '${editInputId}', '${contentId}', '${editFormId}', '${errorId}')">
                <button title="Cancel" onclick="hide('${editFormId}')" type="reset">X</button>
                <div class="error" id=${errorId}></div>
                </div>`;
        answerDiv.innerHTML = ansDivHtml;
        append(userAnsDiv, answerDiv);
        if (answer.accepted) {
          showInline(acceptedId)
        }
        count21 += 1;
      })
      count2 += 1;
    });
  })
  .catch(error => console.log(error));

const addAnswers = (questionId, answerDivId) => {
  url = urlSeg + 'questions/' + questionId + '/answers';
  let myCount = 1;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      let count12 = 1;
      const mainAnsDiv = document.getElementById(answerDivId);
      return data.map((answer) => {
        const acceptId = 'accept' + myCount + count12;
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const divAnsHtml = `
            <h4><u>@${answer.username}</u></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote">&#8607;</span>
            <span>${answer.upvotes}</span>
            <span class="votes" title="downvote">&#8609;</span>
            <span>${answer.downvotes}</span>
            <span class="accept" id="${acceptId}" title="Accept answer?" onclick="acceptAnswer('${questionId}', '${answer.id}', '${answerDivId}', '${myCount}')">&#10003;</span>`;
        answerDiv.innerHTML = divAnsHtml;
        append(mainAnsDiv, answerDiv);
        if (answer.accepted) {
          const acceptSpan = document.getElementById(acceptId);
          acceptSpan.classList.add('accepted_answer');
          acceptSpan.setAttribute('title', 'Accepted answer');
        }
        count12 += 1;
      })
    })
    .catch(error => console.log(error));
  myCount += 1;
};

const deleteQst = (qid, childId) => {
  const res = confirm('Are you sure you want to delete this question?');
  if (res === true) {
    url = urlSeg + 'questions/' + qid;
    fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    })
      .then(response => response.json())
      .then((data) => {
        reload();
      })
      .catch(error => console.log(error))
  }
};

const acceptAnswer = (questionId, answerId, answerDivId, myCount) => {
  url = urlSeg + "questions/" + questionId + '/answers/' + answerId
  fetch(url, {
      method: 'PUT',
      headers: {
          Authorization: token,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
  })
  .then(response => response.json())
  .then((data) => {
      document.getElementById(answerDivId).innerHTML = "";
      fetchSingleQuestion(questionId, answerDivId, myCount);
  })
  .catch(error => console.log(error))
};

const fetchSingleQuestion = (questionId, answerDivId, myCount) => {
  url = urlSeg + "questions/" + questionId;
  fetch(url)
  .then(response => response.json())
  .then((data) => {
    answers = data.answers
    let count12 = 1;
    return answers.map((answer) => {
      const acceptId = 'accept' + myCount + count12;
      const answerDiv = createNode('div');
      answerDiv.classList.add('answer_card');
      const divAnsHtml = `
            <h4><u>@${answer.username}</u></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote">&#8607;</span>
            <span>${answer.upvotes}</span>
            <span class="votes" title="downvote">&#8609;</span>
            <span>${answer.downvotes}</span>
            <span class="accept" id="${acceptId}" title="Accept answer?" onclick="acceptAnswer('${questionId}', '${answer.id}', '${answerDivId}', '${myCount}')">&#10003;</span>`;
      answerDiv.innerHTML = divAnsHtml;
      append(document.getElementById(answerDivId), answerDiv);
      if (answer.accepted) {
        const acceptSpan = document.getElementById(acceptId);
        acceptSpan.classList.add('accepted_answer');
        acceptSpan.setAttribute('title', 'Accepted answer');
      }
      count12 += 1;
    })
  })
}

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
      else {
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
      status = response.status
      return response.json()
    })
    .then((data) => {
      if (status === 200) {
        document.getElementById(divId).innerHTML = content;
        hide(editFormId);
      } else{
        addError(data, errorId)
      }
      
    })
    .catch(error => console.log(error))
}