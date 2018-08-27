function display(div_id){
    document.getElementById("buttons").style.display = "none";
    if (div_id == "signup") {
        document.getElementById("login").style.display = "none";
        document.getElementById("signup").style.display = "block";
        }
    if (div_id == "login") {
        document.getElementById("login").style.display = "block";
        document.getElementById("signup").style.display = "none";
    }
}