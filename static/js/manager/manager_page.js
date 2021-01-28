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


var wrapper = document.getElementById('workPackages');
FillUserColumns(wrapper)

function FillUserColumns(wrapper){

	var url = '/api/workPackage-list/'+projectId+"/"+user_department
	
	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		var workpackage = data
		
        wrapper.innerHTML =''

		for(var i in workpackage){
            var item = 
            `
                <div class="alert alert-success workpackage-list" role="alert" id="workpackage-${workpackage[i].id}" data-id="${workpackage[i].id}" data-title="${workpackage[i].title}">
                    ${workpackage[i].title}
                </div>
            `
            wrapper.innerHTML += item
        }
        for(var i in workpackage){
            var SWPURL = '/api/subWorkPackages-list/'+workpackage[i].id
            checkingCardCompletion(SWPURL, workpackage, i)
        }
        
		getCardDetails()
	})
}
function checkingCardCompletion(SWPURL, workpackage, i){
    fetch(SWPURL)
    .then((resp) => resp.json())
    .then(function(data){
        var subworkpackage = data
        for(var j in subworkpackage){
            if(subworkpackage[j].responsible == null){
                $("#workpackage-"+workpackage[i].id).removeClass("alert-success")
                $("#workpackage-"+workpackage[i].id).addClass("alert-danger")
                break
            }
        }
    })
}
function getCardDetails(){
    //Card clicked
    var workpackageCards = document.getElementsByClassName("workpackage-list")
    
    for(var i = 0; i < workpackageCards.length; i++)
    {
        workpackageCards[i].addEventListener('click', function(){

            var workpackageId = this.dataset.id
            var workpackageTitle =this.dataset.title
            var url = '/api/subWorkPackages-list/'+workpackageId
            var wrapper = document.getElementById('subworkpackage');

			userURL = '/api/project-user_list/'+projectId+'/'+workpackageId
            fetch(userURL)
            .then((resp) => resp.json())
            .then(function(data){
                var user = data
                var userSelectList = ''
                for(var i in user){
                    userSelectList += '<option value="'+user[i].id+'">'+ user[i].username +'</option>'
                }
                fetch(url)
                .then((resp) => resp.json())
                .then(function(data){
                    var subworkpackage = data
                    
                    wrapper.innerHTML =''
                    var item = 
                    `
                        <div class="col-8"><h3 class="text-center" id='subworkpackageTitle'>`+workpackageTitle+`<hr></h3></div>
                        <div class="col-4"><h3  class="text-center ">Assign To<hr></h3></div>
                        <div class="w-100"></div>
                    `
                    wrapper.innerHTML += item
                    for(var i in subworkpackage){
                        var item = 
                        `
                            <div class="col-7  border pt-3">
                                <div class="alert alert-success subworkpackage-list" style="width:100%!important" role="alert" id="subworkpackage-${subworkpackage[i].id}" data-id="${subworkpackage[i].id}">
                                    ${subworkpackage[i].title}
                                </div>
                            </div>

                            <div class="col-5  border pt-3">
                                <form action="" method="POST" id="AssignUserForm-${subworkpackage[i].id}">
                                    <div class="form-row">
                                        <div class="col">
                                            <select name="responsible" required="" class="form-control" id="dropDown-${subworkpackage[i].id}">
                                                <option value="-1">---------</option>
                                                `+userSelectList+`
                                            </select>
                                        </div>
                                        <div class"col">
                                        <input class="btn btn-success submit-user-buttom" type="button" id="button-${subworkpackage[i].id}" data-id="${subworkpackage[i].id}">
                                        </div>
                                    </div>
                                </form>
                            </div>
                        `
                        wrapper.innerHTML += item
                    }
                    for(var i in subworkpackage){
                        if(subworkpackage[i].responsible != null){
                            $("#dropDown-"+subworkpackage[i].id).val(subworkpackage[i].responsible)
                            $("#button-"+subworkpackage[i].id).addClass("btn-danger")
                            $("#button-"+subworkpackage[i].id).val("Revoke")
                        }
                        else{
                            $("#button-"+subworkpackage[i].id).addClass("btn-success")
                            $("#button-"+subworkpackage[i].id).val("Assign")
                        }
                    }
                    assignUserForm()
                })
            })
        })
    }
}
function assignUserForm(){
    
    //clicked
    var submitButtons = document.getElementsByClassName("submit-user-buttom")
    
    for(var i = 0; i < submitButtons.length; i++)
    {
        submitButtons[i].addEventListener('click', function(){
            var buttonId = this.dataset.id
            
            if($("#dropDown-"+buttonId).val() != -1){
                $('#cover-spin').show(0);
                var serializedData = $("#AssignUserForm-"+buttonId).serialize();
                if($("#button-"+buttonId).val() != "Revoke"){
                    serializedData = "csrfmiddlewaretoken=" + csrftoken + "&" + serializedData + "&subworkpackage="+buttonId}
                else
                    serializedData = "csrfmiddlewaretoken=" + csrftoken + "&responsible=null"+ "&" + "subworkpackage="+buttonId
                
                $.ajax({
                    url: "/api/update-subworkpackage-user",
                    data: serializedData,
                    type: 'post',
                    success: function(response){
                        if($("#button-"+buttonId).val() != "Revoke"){
                            $("#button-"+buttonId).removeClass("btn-success")
                            $("#button-"+buttonId).addClass("btn-danger")
                            $("#button-"+buttonId).val("Revoke")
                        }
                        else{
                            $("#button-"+buttonId).removeClass("btn-danger")
                            $("#button-"+buttonId).addClass("btn-success")
                            $("#button-"+buttonId).val("Assign")
                            $("#dropDown-"+buttonId).val("-1")
                        }
                        $('#cover-spin').hide(0);
                    },
                    error: function(response){
                        $('#cover-spin').hide(0);
                    }
                })
            }
        })
    }
}
