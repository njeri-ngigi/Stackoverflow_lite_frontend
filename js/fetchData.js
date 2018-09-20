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
let my_token = localStorage.getItem("token");
if (my_token === undefined || my_token === null || my_token === "") {
  hide('profileH3');
  showBlock('loginH3');
} 

const divMain = document.getElementById('questions');
const url_seg = "http://localhost:5000/api/v1/";
let url = url_seg + 'questions?pages=1';
let count = 1;

const getEl = id => document.getElementById(id).value;
const showAlert = message => setTimeout(function () { alert(message); }, 300);

// Fetch and display all questions
fetch(url)
  .then(response => response.json())
  .then((data) => {
    return data.map((question) => {
      let addId = "add" + count;
      let hideId = "hide" + count;
      let answerId = "answer" + count;
      let buttonId = "button" + count;
      let contentId = "content" + count;
      let h = `
          <h2><u>${question.title}</u></h2>
          <h5>asked by ${question.username}</h5>
          <p>${question.content}</p>
          <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showInline('${hideId}')"> forum </i> 
          <span>${question.answers_given}</span>
          <span class="add" title="Answer this question" onclick="showBlock('${addId}')">&#xff0b;</span>
          <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
          <div class="add_comment_card" id="${addId}">
            <input id=${contentId} type="text" placeholder="Answer this question ..."><br><br>
            <input id=${buttonId} type="button" value="Add" onclick="postAnswer('${question.id}', '${contentId}', '${addId}')">
            <button title="Cancel" onclick="hide('${addId}')" type="reset">X</button>
          </div>`;

      let qDiv = createNode('div');
      let ansDiv = createNode('div');
      qDiv.classList.add('question_card');
      qDiv.innerHTML = h;
      ansDiv.setAttribute('id', answerId);
      ansDiv.classList.add('answers');
      addAnswers(question.id, ansDiv);
      append(qDiv, ansDiv);
      append(divMain, qDiv);
      ++count;
    })
  })
  .catch(error => console.log(error));

const addAnswers = (questionId, ansDiv) => {
  url = url_seg + "questions/" + questionId + "/answers";
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((answer) => {
        const answerDiv = createNode('div');
        answerDiv.classList.add('answer_card');
        const c = `
            <h4><u>@${answer.username}</u></h4>
            <p>${answer.content}</p>
            <span class="votes" title="upvote">&#8607;</span>
            <span>${answer.upvotes}</span>
            <span class="votes" title="downvote">&#8609;</span>
            <span>${answer.downvotes}</span>`; 
        answerDiv.innerHTML = c;
        append(ansDiv, answerDiv);
      })
    })
}

const postQuestions = (divId) => {
  let title = getEl('titleQst');
  let content = getEl('contentQst');
  url = url_seg + 'questions/';
  let data = {
    title: title,
    content: content
  }
  postStuff(url, data, divId);

}

let postAnswer = (questionId, contentId, divId) => {
  let content = getEl(contentId);
  let data = {
    content: content
  };
  url = url_seg + 'questions/' + questionId + '/answers';
  postStuff(url, data, divId);
};
let status = "";

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
        window.location.reload();
        hide(divId);
      }
    })
    .catch(error => console.log(error))
};

const logout = () => {
  url = url_seg + "auth/logout";
  token = localStorage.getItem('token');
  token = "Bearer " + token; 

  fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': token
    }
  })
  .then((response) => {
      status = response.status;
      return response.json();
  })
  .then((data) => {
      localStorage.removeItem("token");
      window.location.replace("./index.html");
      if (status !== 200) {
        showAlert(data.msg);
      }
      else{
        showAlert(data.message);
      }      
  })
  .catch(error => console.log(error))
}

