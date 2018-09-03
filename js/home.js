function displayComments(div_id){
    if (div_id == "answers1") {
        document.getElementById("answers1").style.display = "block";
        document.getElementById("hide1").style.display = "inline";
        document.getElementById("answers2").style.display = "none";
        document.getElementById("answers3").style.display = "none"
    }
    if (div_id == "answers2") {
        document.getElementById("answers1").style.display = "none";
        document.getElementById("answers2").style.display = "block";
        document.getElementById("hide2").style.display = "inline";
        document.getElementById("answers3").style.display = "none";
    }
    if (div_id == "answers3") {
        document.getElementById("answers1").style.display = "none";
        document.getElementById("answers2").style.display = "none";
        document.getElementById("answers3").style.display = "block";
        document.getElementById("hide3").style.display = "inline";

    }
}

function showAddComment(div_id){
    document.getElementById(div_id).style.display = "block";
}
function hideAddComment(div_id) {
    document.getElementById(div_id).style.display = "none";
}
