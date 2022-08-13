$(document).ready(function(){
    window.onload = () => {
        $("#myModal").modal("show");
    }
    // close window 
    $("#close").on('click', function(){
        window.location.href = "/"
    })
})