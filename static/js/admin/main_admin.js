function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

$('select[id="user-Type"]').change(function(){
    console.log($("#user-Type").val())
    if($("#user-Type").val()==2){
        $("#user-list").hide()
        $("#manager-list").show()
    }
    else{
        $("#manager-list").hide()
        $("#user-list").show()
    }

})
