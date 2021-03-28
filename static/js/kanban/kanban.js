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
				<div class="list-item card" id="${card.id}" draggable="true" data-id="${card.id}" data-state="${card.state}"  style="border-left-width:thick;border-left-color:${card.border_color}">
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

const columnBuilder = () =>{
    var wrapper = document.getElementById('taskCardContainer');
	$("#taskCardContainer").html("")
	var url = '/api/states/'

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
        data.map((state) => {

            div = 	document.createElement('div')	
					div.setAttribute('id', "column-"+state.id);
					div.setAttribute('data-state', state.id);
					div.setAttribute('data-order', state.order);
					div.setAttribute('data-forward_movement', state.forward_movement);
					div.setAttribute('data-backward_movement', state.backward_movement);
					div.setAttribute('style', "min-height: 600px;");
					div.classList.add('list')
					div.classList.add('col')
					div.classList.add('rounded-lg')
					div.classList.add('m-1')
					div.classList.add('border')
					div.classList.add('border-dark')
					div.innerHTML =`
					<p>${state.title}</p>
					<hr style="background-color:#0091D5;"/>`;
                    wrapper.appendChild(div);
        });
		var columns="";
		data.map((state) => {
			columns = columns + "#column-"+state.id+",";
		});
		columns = columns.substring(0, columns.length-1)
        FillColumns();
		$(columns).sortable({
            connectWith: ".list",

			stop: function(ev, div) {
				const parentDiv = $(div.item)[0].parentElement.dataset.order;
				
				if(this.dataset.order == parentDiv || this.dataset.order > parentDiv && this.dataset.backward_movement=="true" || this.dataset.order < parentDiv && this.dataset.forward_movement=="true")
				{
					const rows = document.getElementsByClassName("list-item");
					let pos = [];
					for (let row of rows) {
						pos.push(row.dataset.id);
					}
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
					})
					
				}
				else
					$(this).sortable("cancel");

				if(this.dataset.order != parentDiv)
				{
					const packageId = $(div.item)[0].id;
					const state = $(div.item)[0].parentElement.dataset.state;
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
			}
        }).disableSelection();
	});
}

columnBuilder()