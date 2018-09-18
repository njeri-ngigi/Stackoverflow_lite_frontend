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

const divMain = document.getElementById('questions');
let url = 'http://localhost:5000/api/v1/questions?pages=1';
let count = 1;

// Fetch and display all questions
fetch(url)
  .then(response => response.json())
  .then(function(data) {
    return data.map(function(question) {
      let addId = "add" + count,
        hideId = "hide" + count,
        answerId = "answer" + count;
      let h = `
          <h2><u>${question.title}</u></h2>
          <h5>asked by ${question.username}</h5>
          <p>${question.content}</p>
          <i class="material-icons" title="View answers" onclick="showBlock('${answerId}'), showInline('${hideId}')"> forum </i> 
          <span>${question.answers_given}</span>
          <span class="add" title="Answer this question" onclick="showBlock('${addId}')">&#xff0b;</span>
          <span class="hide_answers" id=${hideId} title="Hide Answers" onclick="hide('${answerId}'), hide('${hideId}')">X</span>
          <div class="add_comment_card" id="${addId}">
            <input type="text" placeholder="Answer this question ..."><br><br>
            <input type="button" value="Add">
            <button title="Cancel" onclick="hide('${addId}')">X</button>
          </div>`;

      let qDiv = createNode('div'),
        ansDiv = createNode('div');
      qDiv.classList.add('question_card');
      qDiv.innerHTML = h;
      ansDiv.setAttribute('id', answerId);
      ansDiv.classList.add('answers')
      addAnswers(question.id, ansDiv);
      append(qDiv, ansDiv);
      append(divMain, qDiv);
      ++count;
    })
  })
  .catch(function(error) {
      console.log(error)
  });

function addAnswers(questionId, ansDiv){
  url = "http://localhost:5000/api/v1/questions/" + questionId + "/answers";
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      return data.map((answer) => {
          let answerDiv = createNode('div');
          answerDiv.classList.add('answer_card');
          let c = `
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
