const getEl = id => document.getElementById(id).value;
const createNode = element => document.createElement(element);
const append = (parent, el) => { return parent.appendChild(el); }
const closeTab = () => window.location.replace("./home.html");

const searchDiv = document.getElementById('search_body')
const urlSeg = "http://localhost:5000/api/v1/";
const searchUrl = urlSeg + "questions/search?limit=20";

let status = '';

const search = (mycontent) => {
  mydata = {content: mycontent}
  console.log(mydata)
  searchDiv.innerHTML = '';
  fetch(searchUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(mydata),
  })
    .then((response) => {
      status = response.status;
      return response.json()
    })
    .then((data)=>{
      console.log(data);
      console.log(data.length);
      if (data.id) {
        console.log("This is me")
        fetchSingleQuestion(data.id);
        return;
      }
      else if (data.length === 0) {
        const emptyHtml = `<p class="empty" id="first_empty">Sorry, we didn't find any matches</p><p class="empty">&#x2639;</p>`;
        searchDiv.innerHTML = emptyHtml;
        return;
      }
      else {
        const h4 = createNode('h4');
        h4.setAttribute('id', 'closestMatch')
        append(searchDiv, h4);
        h4.innerHTML = 'Closest matches:'
        for (let i=0; i<data.length; i++) {
          const searchHTML = `<p class="links" onclick="search('${data[i]}')" title="Is this what your looking for?">${data[i]}</p>`
          const div = createNode('div');
          div.innerHTML = searchHTML;
          append(searchDiv, div)
        }
      }
    })
    .catch(error => console.log(error))
}
const searchQuestion = () => search(getEl('search_title'));

const fetchSingleQuestion = (questionId) => {
  const url = urlSeg + 'questions/' + questionId;
  fetch(url)
    .then(response => response.json())
    .then((data) => {
      
      const html = `
          <h2><u>${data.title}</u></h2>
          <h5>asked by ${data.username}</h5>
          <p>${data.content}</p>
          <i class="material-icons" title="View answers"> forum </i> 
          <span>${data.answers_count}</span>
      `;
      const qDiv = createNode('div');
      qDiv.classList.add('question_card');
      qDiv.innerHTML = html;
      console.log("Hey");
      const answers = data.answers;
      console.log(answers)
      answers.map((answer) => {
        const ansDiv = createNode('div');
        ansDiv.classList.add('answer_card');
        const ansDivHtml = `
              <h4><u>@${answer.username}</u></h4>
              <p>${answer.content}</p>
              <span class="votes" title="upvotes">&#8607;</span>
              <span>${answer.upvotes}</span>
              <span class="votes" title="downvotes">&#8609;</span>
              <span>${answer.downvotes}</span>
              `;
        ansDiv.innerHTML = ansDivHtml;
        append(qDiv, ansDiv);
        
        if (answer.accepted) {
          const acceptSpan = createNode('span');
          acceptSpan.innerHTML = '&#10003;';
          acceptSpan.setAttribute('title', 'Accepted answer')
          acceptSpan.classList.add('accept');
          acceptSpan.classList.add('accepted_answer');
          append(ansDiv, acceptSpan);
        }
      })
      append(searchDiv, qDiv);
    })
    .catch(error => console.log(error));
};
