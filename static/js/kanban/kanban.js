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

const FillColumns = () =>{
    var url = '/api/workpackage/'
    fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
        data.map((card) => {
            var wrapper = document.getElementById('column-'+card.state);
            var item = 
            `
				<div class="list-item card mt-1" id="${card.id}" draggable="true" data-id="${card.id}" data-state="${card.state}"  style="border-left-width:thick;border-left-color:${card.border_color}">
					<!--DropDown -->
					<div class="dropdown" data-id = "${card.id}">
						<button class="btn float-right btn-sm" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<i class="fa fa-ellipsis-v text-warning"></i>
						</button>
						<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
							<button data-toggle="modal" data-target="#EditModal" class="editButtonSWPClass dropdown-item btn-sm" data-id="${card.id}">Edit</button>
							<button class="deleteButtonSWPClass dropdown-item btn-sm" data-id="${card.id}">Delete</button>
						</div>
					
						<!--/DropDown -->
						<div class="card-body">
							<h6 class="card-title" id="${card.id}-taskTitle">${card.title}</h6>
							<small><p class="card-text text-muted" id="${card.id}-taskDescription">${card.description}</p></small>
							<small><p class="card-text text-muted" id="${card.id}-taskProject">Project : ${card.project_Id}</p></small>
						</div>
					</div>
				</div>
			`
            wrapper.innerHTML += item;
        });
	});
}
const stateUpdate = (state, packageId) =>{
	console.log("calledStateUpdate")
	$.ajax({
		url: '/api/update-state/',
		data: {
			csrfmiddlewaretoken: csrftoken,
			id : packageId,
			state : state,
		},
		type: 'post',
		success: function(){
			
		},
		error: function(){
			
		}
	})
}
const orderUpdate = (pos, state, packageId, order, parentDivOrder) =>{
	console.log("calledOrderUpdate")
	$.ajax({
		url: '/api/update-order/',
		data: {
			csrfmiddlewaretoken: csrftoken,
			position : pos.join(','),
		},
		type: 'post',
		success: function(){

		},
		error: function(){
			
		}
	}).done(function (){
		if(order != parentDivOrder)
			stateUpdate(state, packageId);
	})
}
const columnBuilder = () =>{
    var wrapper = document.getElementById('taskCardContainer');
	$("#taskCardContainer").html("")
	var url = '/api/states/'

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		data.map((state) => {

            div = 	document.createElement('div')	
					div.setAttribute('id', "outer-column-"+state.id);
					div.classList.add('rounded-lg')
					div.classList.add('p-0')
					div.classList.add('m-1')
					div.classList.add('col')
					div.innerHTML =`
					<h6><p class="p-2 bg-info text-white rounded-lg">${state.title}</p></h6>
					<hr style="background-color:#0091D5;"/>`;
                    wrapper.appendChild(div);
        });
        data.map((state) => {
			innerWrapper = document.getElementById("outer-column-"+state.id)
            div = 	document.createElement('div')
					div.setAttribute('id', "column-"+state.id);
					div.setAttribute('data-state', state.id);
					div.setAttribute('data-order', state.order);
					div.setAttribute('data-forward_movement', state.forward_movement);
					div.setAttribute('data-backward_movement', state.backward_movement);
					div.setAttribute('style', "min-height: 600px;min-width: 200px;");
					div.classList.add('list')
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
            connectWith: ".list",
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
				if(
					order == parentDivOrder 
					|| order > parentDivOrder && this.dataset.backward_movement=="true" 
					|| order < parentDivOrder && this.dataset.forward_movement=="true"
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