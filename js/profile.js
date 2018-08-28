function showPostQuestion(divId) {
    if (divId == 'postQuestion') {
        document.getElementById('postQuestion').style.display = 'block';
        document.getElementById('profileDetails').style.display = 'none';
  }
    if (divId == 'profileDetails') {
        document.getElementById('postQuestion').style.display = 'none';
        document.getElementById('profileDetails').style.display = 'block';
  }  
}
function showEditProfile(divId) {
    if (divId == 'editProfile') {
        document.getElementById('editProfile').style.display = 'block';
        document.getElementById('main').style.display = 'none';
    }
    if (divId == 'main') {
        document.getElementById('editProfile').style.display = "none";
        document.getElementById('main').style.display = "block";
    }
}
function showEditPassword(){
    document.getElementById('changePassword').style.display = 'block';
    document.getElementById('changePasswordButton').style.display = "none";
}
function showQuestionCards(divId){
    if (divId == 'userQuestions') {
        document.getElementById('userQuestions').style.display = 'block';
        document.getElementById('userAnswers').style.display = 'none';
    }
    if (divId == 'userAnswers') {
        document.getElementById('userQuestions').style.display = 'none';
        document.getElementById('userAnswers').style.display = 'block';
    }  
}