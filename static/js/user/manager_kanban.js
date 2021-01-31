function FillBuildedBoardColumns_WP(){
    project_Id = $('select[id="selectedProject"]').val()
	if(filter_data == '')
	{
		if(project_Id == '-1')
			var url = '/api/subWorkPackages-user-list/'+userId
		else
			var url = '/api/single-subWorkPackages-user-list/'+userId+'/'+ project_Id
	}
	else{
		if(project_Id == '-1')
			var url = '/api/subWorkPackages-user-list/'+userId+'?'+filter_data
		else
			var url = '/api/single-subWorkPackages-user-list/'+userId+'/'+ project_Id+'?'+filter_data
	}

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){

		var kanbanCards = data
		console.log(url)
		
		for(var i in kanbanCards){
			
			if(kanbanCards[i].state != null){
				var wrapper = document.getElementById('column-'+kanbanCards[i].state+'-priority-'+kanbanCards[i].priority);
				var item = `
				<div class="list-item card" id="${kanbanCards[i].id}" draggable="true" data-id="${kanbanCards[i].id}" data-state="${kanbanCards[i].state}" data-priority="${kanbanCards[i].priority}">
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
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskProject">${kanbanCards[i].project_Id}</p></small>
						</div>
					</div>
				</div>
				`
			}
			else{
				var wrapper = document.getElementById('column-1-priority-1');
				var item = `
				<div class="list-item card" id="${kanbanCards[i].id}" draggable="true" data-id="${kanbanCards[i].id}" data-state="${kanbanCards[i].state}" data-priority="1">
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
							<small><p class="card-text text-muted" id="${kanbanCards[i].id}-taskProject">${kanbanCards[i].project_Id}</p></small>
						</div>
					</div>
				</div>
				`
			}
			wrapper.innerHTML += item
			
		}
	})

}