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
