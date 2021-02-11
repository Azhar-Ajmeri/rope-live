function FillBuildedBoardColumns_WP(){
    project_Id = $('select[id="selectedProject"]').val()
	
	if(project_Id == '-1')
		var url = '/api/workPackagesByDepartment-list/'+userId+"/"+department_id
	else
		var url = '/api/project-WorkPackagesByDepartment-list/'+department_id+'/'+ project_Id

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){

		var kanbanCards = data
		console.log(data)
		for(var i in kanbanCards){
			if(kanbanCards[i].state != null){
				var wrapper = document.getElementById('column-'+kanbanCards[i].state);
				var item = `
				<div class="list-item card" id="${kanbanCards[i].id}" draggable="true" data-id="${kanbanCards[i].id}" data-state="${kanbanCards[i].state}" data-priority="${kanbanCards[i].priority}" style="border-left-width:thick;border-left-color:${kanbanCards[i].border_color}">
					<!--DropDown -->
					<div class="dropdown" data-id = "${kanbanCards[i].id}">
						<button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v text-warning"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button data-toggle="modal" data-target="#EditWPModal" class="editButtonWPClass dropdown-item btn-sm" data-id="${kanbanCards[i].id}">Edit</button>
							<button class="deleteButtonWPClass dropdown-item btn-sm" data-id="${kanbanCards[i].id}">Delete</button>
						</div>
					
						<!--/DropDown -->
						<div class="card-body">
							<h6 class="card-title" id="${kanbanCards[i].id}-taskTitle">${kanbanCards[i].title}</h6>
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskDescription">${kanbanCards[i].description}</p></small>
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskProject">Project : ${kanbanCards[i].project_Id}</p></small>
						</div>
					</div>
				</div>
				`
			}
			else{
				var wrapper = document.getElementById('column-1');
				var item = `
				<div class="list-item card" id="${kanbanCards[i].id}" draggable="true" data-id="${kanbanCards[i].id}" data-state="${kanbanCards[i].state}" data-priority="1"  style="border-left-width:thick;border-left-color:${kanbanCards[i].border_color}">
					<!--DropDown -->
					<div class="dropdown" data-id = "${kanbanCards[i].id}">
						<button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v text-warning"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button data-toggle="modal" data-target="#EditModal" class="editButtonSWPClass dropdown-item btn-sm" data-id="${kanbanCards[i].id}">Edit</button>
							<button class="deleteButtonSWPClass dropdown-item btn-sm" data-id="${kanbanCards[i].id}">Delete</button>
						</div>
					
						<!--/DropDown -->
						<div class="card-body">
							<h6 class="card-title" id="${kanbanCards[i].id}-taskTitle">${kanbanCards[i].title}</h6>
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskDescription">${kanbanCards[i].description}</p></small>
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskProject">Project : ${kanbanCards[i].project_Id}</p></small>
						</div>
					</div>
				</div>
				`
			}
			wrapper.innerHTML += item	
		}
	})
}

$("#blurEditForm-wp").hide()
$("#Loader-spin-wp").hide()
priority_before_edit = 0;
//Get project values for Editing Ajax function
$("#taskCardContainer").on('click','.editButtonWPClass',function(){
    wpID = $(this).data('id');
    wpSTATE = document.getElementById(wpID).dataset.state;

    $("#blurEditForm").show()
    $("#Loader-spin").show()

    $.ajax({
        url: '/projects/'+ wpID +'/getWorkpackageFormValues/',
        data: {
            csrfmiddlewaretoken: csrftoken,
            Id: wpID
        },
        type: 'post',    
        success: function(response){
            $("#editWPForm")[0].reset();
            
            document.getElementById("id_wptitle").defaultValue = response.field.title;

            if(response.field.description != null){document.getElementById("id_wpdescription").defaultValue = response.field.description;}
            else{document.getElementById("id_wpdescription").defaultValue = "";}

            if(response.field.date_of_start != null){document.getElementById("id_wpdate_of_start").defaultValue = response.field.date_of_start;}
            else{document.getElementById("id_wpdate_of_start").defaultValue = "";}

            if(response.field.date_of_end != null){document.getElementById("id_wpdate_of_end").defaultValue = response.field.date_of_end;}
            else{document.getElementById("id_wpdate_of_end").defaultValue = "";}

            if(response.field.efforts_planned != null){document.getElementById("id_wpefforts_planned").defaultValue = response.field.efforts_planned;}
            else{document.getElementById("id_wpefforts_planned").defaultValue = "";}
            
            $("#id_wppriority").val( response.field.priority );
			priority_before_edit = response.field.priority;
            
            if(wpSTATE == 3){
                $("#id_wptitle").prop('disabled', true);
                $("#id_wpdate_of_start").prop('disabled', true);
                $("#id_wpdate_of_end").prop('disabled', true);
                $("#id_wpefforts_planned").prop('disabled', true);
                $("#id_wppriority").prop('disabled', true);
            }
            else if(wpSTATE == 4){
                $("#id_wptitle").prop('disabled', true);
                $("#id_wpdescription").prop('disabled', true);
                $("#id_wpdate_of_start").prop('disabled', true);
                $("#id_wpdate_of_end").prop('disabled', true);
                $("#id_wpefforts_planned").prop('disabled', true);
                $("#id_wppriority").prop('disabled', true);
            }
            else{
                $("#id_wptitle").prop('disabled', false);
                $("#id_wpdescription").prop('disabled', false);
                $("#id_wpdate_of_start").prop('disabled', false);
                $("#id_wpdate_of_end").prop('disabled', false);
                $("#id_wpefforts_planned").prop('disabled', false);
                $("#id_wppriority").prop('disabled', false);
            }

            $("#blurEditForm-wp").hide()
            $("#Loader-spin-wp").hide()
        }
    });
});

$('#editWPModalButton').click(function(){
    var serializedData = $("#editWPForm").serialize();
    console.log(serializedData)
    $.ajax({
        url: '/api/workPackage-manual-update/'+wpID+'/',
        data: serializedData,
        type: 'post',

        success: function(response){
            document.getElementById(response.WorkPackage.id+"-taskTitle").innerHTML = response.WorkPackage.title;

            document.getElementById(response.WorkPackage.id+"-taskDescription").innerHTML = response.WorkPackage.description+"";
			if(priority_before_edit != response.WorkPackage.priority)
			{
				var state = document.getElementById(response.WorkPackage.id).dataset.state;
				$('#'+response.WorkPackage.id).appendTo('#column-'+state+'-priority-'+response.WorkPackage.priority);
			}
        }
    });

    $("#editSWPForm")[0].reset();
	document.getElementById('editWPModalDismissButton').click();
});