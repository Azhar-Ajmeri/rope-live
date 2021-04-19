var state = {};
var workpackage = {};

const FillColumns = () =>{
    var url = '/api/workpackage/'
    fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		workpackage = data;
        data.map((card) => {
			if(user_type == 1){
				var wrapper = document.getElementById('column-'+card.state);
			}
			else{
				if(card.emp_status == 1 || card.emp_status == 2)
					return;
				if(card.manager_status == 4 || card.manager_status == 5){
					var wrapper = document.getElementById('column-'+1);
				}
				else if(card.manager_status == 6){
					var wrapper = document.getElementById('column-'+2);
				}
				else{
					var wrapper = document.getElementById('column-'+3);
				}
			}
            var item = 
            `
				<div class="list-item card mt-1" id="${card.id}" draggable="true" data-id="${card.id}" style="border-left-width:thick;border-left-color:${card.border_color}">
					<!--DropDown -->
					<div class="dropdown" data-id = "${card.id}">
						<button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v text-warning"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button data-toggle="modal" data-target="#EditModal" class="update-Fields dropdown-item btn-sm" data-id="${card.id}">Edit</button>
							<button class="deleteWPClass dropdown-item btn-sm" data-id="${card.id}">Delete</button>
						</div>
					
						<!--/DropDown -->
						<div class="card-body">
							<h6 class="card-title" id="${card.id}-taskTitle">${card.title}</h6>
							<small><p class="card-text text-muted" id="${card.id}-taskDescription">${card.description}</p></small>
							<small><p class="card-text text-muted" id="${card.id}-taskProject">Project : ${card.project}</p></small>
						</div>
					</div>
				</div>
			`
            wrapper.innerHTML += item;
        });
	});
	$('#cover-spin').hide(0);
}
const stateUpdate = (state, packageId) =>{
	$.ajax({
		url: '/api/update-state/',
		data: {
			csrfmiddlewaretoken: csrftoken,
			id : packageId,
			state : state,
		},
		type: 'POST',
		success: function(response){
			workpackage.find(item => {
				if(item.id == response.id)
				{
					Object.keys(response).forEach(function(key) {
						item[key] = response[key];
					});
					return;
				}
			});
		}
	})
}
const orderUpdate = (pos, state, packageId, order, parentDivOrder) =>{
	$.ajax({
		url: '/api/update-order/',
		data: {
			csrfmiddlewaretoken: csrftoken,
			position : pos.join(','),
		},
		type: 'post',
	}).done(function (){
		if(order != parentDivOrder)
			stateUpdate(state, packageId);
	})
}
const columnBuilder = () =>{
	$('#cover-spin').show(0);
    var wrapper = document.getElementById('taskCardContainer');
	$("#taskCardContainer").html("")
	var url = '/api/states/'

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		state = data;
		data.map((state) => {

            div = 	document.createElement('div')	
					div.setAttribute('id', "outer-column-"+state.id);
					div.classList.add('rounded-lg')
					div.classList.add('p-0')
					div.setAttribute('style', "min-width: 200px;");
					div.classList.add('list')
					div.classList.add('m-1')
					div.classList.add('col')
					div.innerHTML =`
					<h6 class="sticky-header"><p class="p-2 bg-info text-white rounded-lg">${state.title}</p></h6>`
                    wrapper.appendChild(div);
        });
        data.map((state) => {
			innerWrapper = document.getElementById("outer-column-"+state.id)
            div = 	document.createElement('div');
					div.setAttribute('id', "column-"+state.id);
					div.setAttribute('data-state', state.id);
					div.setAttribute('data-order', state.order);
					if(user_type == 1){
						div.setAttribute('data-forward_movement', state.forward_movement_emp);
						div.setAttribute('data-backward_movement', state.backward_movement_emp);
					}
					else{
						div.setAttribute('data-forward_movement', state.forward_movement_manager);
						div.setAttribute('data-backward_movement', state.backward_movement_manager);
					}
					div.setAttribute('style', "min-width: 200px;");
					div.classList.add('inner-list')
					div.classList.add('col')
					div.classList.add('p-2')					
					div.innerHTML = `
					`
                    innerWrapper.appendChild(div);
        });
		var columns="";
		data.map((state) => {
			columns = columns + "#column-"+state.id+",";
		});
		columns = columns.substring(0, columns.length-1)
        FillColumns();
		$(columns).sortable({
            connectWith: ".inner-list",
			containment: $("#taskCardContainer"),
			start: function(event, div) {
				const rows = document.getElementsByClassName("list-item");
				
				let pos = [];
				for (let row of rows) {
					pos.push(row.dataset.id);
				}
				pos = pos.filter( Number );
				div.item.data('start_pos', pos);
			},
			stop: function(ev, div) {
				
				let parentDivOrder = $(div.item)[0].parentElement.dataset.order;
				let packageId = $(div.item)[0].id;
				let state = $(div.item)[0].parentElement.dataset.state;
				let order = this.dataset.order;
				if(order == parentDivOrder
					|| order > parentDivOrder && this.dataset.backward_movement=="true" && (parseInt(order)+1 == parseInt(parentDivOrder) || parseInt(order)-1 == parseInt(parentDivOrder)) 
					|| order < parentDivOrder && this.dataset.forward_movement=="true" && (parseInt(order)+1 == parseInt(parentDivOrder) || parseInt(order)-1 == parseInt(parentDivOrder))
					)
				{
					const rows = document.getElementsByClassName("list-item");
					let pos = [];
					for (let row of rows) {
						pos.push(row.dataset.id);
					}
					start_pos = div.item.data('start_pos').join(',')
					if (start_pos != pos.join(','))
						orderUpdate(pos, state, packageId, order, parentDivOrder);
					else if(order != parentDivOrder)
						stateUpdate(state, packageId);
				}
				else
					$(this).sortable("cancel");
			}
        }).disableSelection();
	});
}

columnBuilder()


$("#taskCardContainer").on('click','.update-Fields',function(){
	$("#blurEditForm").show()
	$("#Loader-spin").show()
	state = $(this).parent().parent().parent().parent().data('state');
	editWorkPackageForm(state, Status_data);

	id = $(this).data('id');
	data = workpackage.find(item => {
		return item.id == id
	})
	$('#update-form *').filter(':input').each(function(){
		if(this.type!="button")
		{
			this.value = data[this.name];
		}
	});

	$("#blurEditForm").hide()
	$("#Loader-spin").hide()
	$('#savebutton').click(function(){
		var serializedData = $("#update-form").serialize();
		$.ajax({
			headers: { "X-CSRFToken": csrftoken },
			url: '/api/workpackage/'+id+'/',
			data: serializedData,
			type: 'PUT',
	
			success: function(response){
				
				if(response.responsible!=undefined && user_type != 1)
				{
					$("#"+id).remove();
				}
				workpackage.find(item => {
					if(item.id == id)
					{
						Object.keys(response).forEach(function(key) {
							item[key] = response[key];
						});
						console.log(item, response)
						return;
					}
				});
			}
		});
		document.getElementById('editModalDismissButton').click();
	});
});
$("#taskCardContainer").on('click','.deleteWPClass',function(){
	id = $(this).data('id');
	console.log("Clicked")
	fetch('/api/workpackage-delete/'+id+'/', {
		method:'DELETE',
		headers:{
			'Content-type':'application/json',
			'X-CSRFToken':csrftoken,
			}
	}).then((response) => {
		$("#"+id).remove();
	});
});


$('#createPackage').click(function() {
	$.ajax({
		url: '/api/workpackage-create/',
		data: $('#create_package_form').serialize(),
		type: 'POST',
		success: function(card){
			$("#create_package_form")[0].reset();
			var wrapper = document.getElementById('column-'+card.state);
			workpackage.push(card);
            var item = 
            `
				<div class="list-item card mt-1" id="${card.id}" draggable="true" data-id="${card.id}" style="border-left-width:thick;border-left-color:${card.border_color}">
					<!--DropDown -->
					<div class="dropdown" data-id = "${card.id}">
						<button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v text-warning"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button data-toggle="modal" data-target="#EditModal" class="update-Fields dropdown-item btn-sm" data-id="${card.id}">Edit</button>
							<button class="deleteWPClass dropdown-item btn-sm" data-id="${card.id}">Delete</button>
						</div>
					
						<!--/DropDown -->
						<div class="card-body">
							<h6 class="card-title" id="${card.id}-taskTitle">${card.title}</h6>
							<small><p class="card-text text-muted" id="${card.id}-taskDescription">${card.description}</p></small>
							<small><p class="card-text text-muted" id="${card.id}-taskProject">Project : ${card.project}</p></small>
						</div>
					</div>
				</div>
			`
            wrapper.innerHTML += item;
		}
	});
});
