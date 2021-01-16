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
                <div class="list-item card" id="${project[i].id}">
                    <!--DropDown -->
                    <div class="dropdown" data-id = "${project[i].id}">
                        <button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa fa-ellipsis-v text-warning"></i>
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button type="button" data-toggle="modal" data-target="#" class="deleteButtonTask dropdown-item btn-sm">Delete</button>
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