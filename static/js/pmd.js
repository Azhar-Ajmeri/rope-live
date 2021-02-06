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

FillBuildedBoardColumns()

function FillBuildedBoardColumns(){

	var url = '/api/project-list'

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){

		var project = data
        
        var wrapper = document.getElementById('project_cards');
        
        wrapper.innerHTML =''	

		for(var i in project){
			
            var item = 
            `
                <div class="list-item card" id="${project[i].id}" style="border-left-width:thick;border-left-color:${project[i].border_color}">
                    <!--DropDown -->
                    <div class="dropdown" data-id = "${project[i].id}">
                        <button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-v text-warning"></i>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button type="button" data-toggle="modal" data-target="#" data-id="${project[i].id}" class="deleteProjectButton dropdown-item btn-sm">Delete</button>
                            <div class="dropdown-divider"></div>
                            <label for="${project[i].id}-colorPicker" class="btn">
                                <input type="color" value="#1DB8CE" id="${project[i].id}-colorPicker" data-id="${project[i].id}">
                            </label>
                        </div>
                    <!--/DropDown -->
                        <a href="admin/${project[i].title}?project_Id=${project[i].id}">
                            <div class="card-body"  data-id="${project[i].id}">
                                <h6 class="card-title" id="${project[i].id}-taskTitle">${project[i].title}</h6>
                            </div>
                        </a>
                    </div>
                </div>        
			`	
				wrapper.innerHTML += item	
			
		}
        BorderColorPicker();
	})

}


//Closing modal on Enter key pressing
function enterKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('modalDismissButton').click();
        document.getElementById('createProjectButton').click();
        return false;
    }
    return true;
}

//Start function
$(document).ready(function(){

    cardDeleter()

    $('#closeMessage').click(function(){$('#message_container').hide(0);})

    //Creating a new project using Ajax function
    $("#createProjectButton").click(function(){
        $('#cover-spin').show(0);
        var serializedData = $("#createProjectForm").serialize();

        $.ajax({
            url: $("createProjectForm").data('url'),
            data: serializedData,
            type: 'post',
            success: function(response){
                $('#cover-spin').hide(0);
                FillBuildedBoardColumns()
            },
            error: function(data){
                var wrapper = document.getElementById('message_content');
                wrapper.innerHTML =''	
                $('#message_container').show(0);
                wrapper.innerHTML = data.responseJSON.error	
                $('#cover-spin').hide(0);
            }
        })
        $("#createProjectForm")[0].reset();
        document.getElementById('modalDismissButton').click();
    });
})


//Deleting Function for Project cards
function cardDeleter(){
    
    $("#project_cards").on('click','.deleteProjectButton',function(){
        globalDataId = $(this).data('id');

        fetch('/api/project-delete/'+globalDataId+'/', {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
                }
        }).then((response) => {
            $("#"+globalDataId).remove();
        })
    })
}



function BorderColorPicker(){
    document.querySelectorAll('input[type=color]').forEach(function(picker) {
        console.log(picker.id)
        var targetLabel = document.querySelector('label[for="' + picker.id + '"]');
        var codeArea = document.createElement('span');
  
        codeArea.innerHTML = picker.value;
        targetLabel.appendChild(codeArea);
  
        picker.addEventListener('change', function() {
            codeArea.innerHTML = picker.value;
            var colorValue = picker.value;
            colorValue = colorValue.replace("#", "");

            project_ID = $(this).data('id');
            console.log('/api/project-update-color/'+project_ID+'/'+colorValue);

            
            $.ajax({
                url: '/api/project-update-color/'+project_ID+'/'+colorValue,
                data: "csrfmiddlewaretoken="+csrftoken,
                type: 'post',
                success: function(response){
                    
                    targetLabel.appendChild(codeArea);
                    $("#"+project_ID).css('border-left-color', picker.value);
                    console.log(response)
                }
            })

        });
      });
}