createDepartments()

function createDepartments(){

	var url = '/api/department-list/'
	
	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		var department = data
		var headerWrapper = document.getElementById('v-pills-tab-manager');
		var contentWrapper = document.getElementById('v-pills-tabContent-manager');
		var selectedContentWrapper = document.getElementById('v-pills-tabContent-selected-manager');
		headerWrapper.innerHTML =''
		contentWrapper.innerHTML =''
		selectedContentWrapper.innerHTML =''
		var Flag = 0
		for(var i in department){
				if(Flag == 0)
				{
					var header = 
					`
					<a class="nav-link mb-3 p-3 border rounded active" id="v-pills-${department[i].title}-tab-manager" data-toggle="pill" href="#v-pills-${department[i].id}-manager" role="tab" aria-controls="v-pills-home" aria-selected="true">
						<i class="fa fa-user-circle-o mr-2"></i>
						<span class="font-weight-bold small text-uppercase" style="word-break: break-all;">${department[i].title}</span></a>
					`
					headerWrapper.innerHTML += header
					var content =
					`
					<div class="tab-pane border rounded bg-white show p-2 active" id="v-pills-${department[i].id}-manager" role="tabpanel" aria-labelledby="v-pills-home-tab">
						
					</div>
					`
					contentWrapper.innerHTML += content
					
					var contentSelected =
					`
					<div class="border rounded mt-3 p-2" id="v-pills-${department[i].id}-selected-manager">
						<h5 class="text-center text-muted">${department[i].title}</h5>
						<hr>
					</div>
					`
					selectedContentWrapper.innerHTML += contentSelected
					Flag = 1
				}
				else{
					var header = 
					`
					<a class="nav-link mb-3 p-3 border rounded" id="v-pills-${department[i].title}-tab-manager" data-toggle="pill" href="#v-pills-${department[i].id}-manager" role="tab" aria-controls="v-pills-home" aria-selected="true">
						<i class="fa fa-user-circle-o mr-2"></i>
						<span class="font-weight-bold small text-uppercase" style="word-break: break-all;">${department[i].title}</span></a>
					`
					headerWrapper.innerHTML += header
					var content =
					`
					<div class="tab-pane border rounded bg-white show p-2" id="v-pills-${department[i].id}-manager" role="tabpanel" aria-labelledby="v-pills-home-tab">
						
					</div>
					`
					contentWrapper.innerHTML += content
					
					var contentSelected =
					`
					<div class="border rounded mt-3 p-2" id="v-pills-${department[i].id}-selected-manager">
						<h5 class="text-center text-muted">${department[i].title}</h5>
						<hr>
					</div>
					`
					selectedContentWrapper.innerHTML += contentSelected
				}

			
		}
	})
	.then(function(){

		var url = '/api/manager-group/'+projectId
		var userGroup = []
		fetch(url)
		.then((resp) => resp.json())
		.then(function(data){
			userGroup = data
			fillManagerColumns()
		})
		function fillManagerColumns(){
			var url = '/api/user-profile-list/'
			fetch(url)
			.then((resp) => resp.json())
			.then(function(data){
				var user = data
				var item = ''
				for(var i in user){
					if(user[i].department != null){
						if(userGroup.some(item => item.user == user[i].id)){
							var wrapper = document.getElementById('v-pills-'+user[i].department+'-selected-manager');
							item = 
							`
							<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-2 mb-2 bg-light border rounded" id="manager-${user[i].id}" data-id="${user[i].id}">
								<div class="row">
									<div class="col-xs-10 col-sm-10 col-md-3 col-lg-3">
										<img class="rounded-circle mx-auto d-block"  style="width: 100%;height: auto;"
											src="${user[i].profile_pic}"
											alt="User Pic">
									</div>
									<div class="col-xs-10 col-sm-10 col-md-9 col-lg-9">
										<strong>${user[i].name}</strong><br>
										<span class="text-muted">User level: Administrator</span>
									</div>
								</div>
								<div class="row mt-2 d-flex justify-content-around">
									<div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
										<input class="select-manager-button btn btn-danger btn-block" value="deselect" type="button" data-id="${user[i].id}" data-department="${user[i].department}" id="select-manager-${user[i].id}"/>
									</div>
									<button class="btn col-xs-5 col-sm-5 col-md-5 col-lg-5" type="button" data-toggle="collapse" data-target="#collapse-${user[i].id}" aria-expanded="false" aria-controls="collapseExample">
										<i class="fa fa-chevron-down text-muted"></i>
									</button>

								</div>
								<div class="row collapse justify-content-center p-3" id="collapse-${user[i].id}">
									<div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1 p-2 rounded">
										<div class="panel panel-primary">
											<div class="panel-heading">
												<h3 class="panel-title">User information</h3>
											</div>
											<div class="panel-body">
												<div class="row">
													<div class="col-md-3 col-lg-3 d-none d-lg-block d-xl-none">
														<img class="img-circle"
															src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100"
															alt="User Pic">
													</div>
													<div class="col-md-9 col-lg-9">
														<strong>${user[i].name}</strong><br>
														<table class="table table-user-information">
															<tbody>
															<tr>
																<td>User level:</td>
																<td>Administrator</td>
															</tr>
															<tr>
																<td>Registered since:</td>
																<td>11/12/2013</td>
															</tr>
															<tr>
																<td>Topics</td>
																<td>15</td>
															</tr>
															<tr>
																<td>Warnings</td>
																<td>0</td>
															</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div class="panel-footer p-2">
												<button class="btn btn-sm btn-primary" type="button"
														data-toggle="tooltip"
														data-original-title="Send message to user">Message</button>
												<span class="pull-right">
													<button class="btn btn-sm btn-warning" type="button"
															data-toggle="tooltip"
															data-original-title="Edit this user">Edit</button>
													<button class="btn btn-sm btn-danger" type="button"
															data-toggle="tooltip"
															data-original-title="Remove this user">Delete</button>
												</span>
											</div>
										</div>
									</div>
								</div>     
							</div>
							`
							wrapper.innerHTML += item
						}
						else{
							var wrapper = document.getElementById('v-pills-'+user[i].department+'-manager');
							item = 
							`
							<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 p-2 mb-2 bg-light border rounded" id="manager-${user[i].id}" data-id="${user[i].id}">
								<div class="row">
									<div class="col-xs-10 col-sm-10 col-md-3 col-lg-3">
										<img class="rounded-circle mx-auto d-block"  style="width: 100%;height: auto;"
											src="${user[i].profile_pic}"
											alt="User Pic">
									</div>
									<div class="col-xs-10 col-sm-10 col-md-9 col-lg-9">
										<strong>${user[i].name}</strong><br>
										<span class="text-muted">User level: Administrator</span>
									</div>
								</div>
								<div class="row mt-2 d-flex justify-content-around">
									<div class="col-xs-5 col-sm-5 col-md-5 col-lg-5">
										<input class="select-manager-button btn btn-success btn-block" value="Select" type="button" data-id="${user[i].id}" data-department="${user[i].department}" id="select-manager-${user[i].id}"/>
									</div>
									<button class="btn col-xs-5 col-sm-5 col-md-5 col-lg-5" type="button" data-toggle="collapse" data-target="#collapse-${user[i].id}" aria-expanded="false" aria-controls="collapseExample">
										<i class="fa fa-chevron-down text-muted"></i>
									</button>

								</div>
								<div class="row collapse justify-content-center p-3" id="collapse-${user[i].id}">
									<div class="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xs-offset-0 col-sm-offset-0 col-md-offset-1 col-lg-offset-1 p-2 rounded">
										<div class="panel panel-primary">
											<div class="panel-heading">
												<h3 class="panel-title">User information</h3>
											</div>
											<div class="panel-body">
												<div class="row">
													<div class="col-md-3 col-lg-3 d-none d-lg-block d-xl-none">
														<img class="img-circle"
															src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=100"
															alt="User Pic">
													</div>
													<div class="col-md-9 col-lg-9">
														<strong>${user[i].name}</strong><br>
														<table class="table table-user-information">
															<tbody>
															<tr>
																<td>User level:</td>
																<td>Administrator</td>
															</tr>
															<tr>
																<td>Registered since:</td>
																<td>11/12/2013</td>
															</tr>
															<tr>
																<td>Topics</td>
																<td>15</td>
															</tr>
															<tr>
																<td>Warnings</td>
																<td>0</td>
															</tr>
															</tbody>
														</table>
													</div>
												</div>
											</div>
											<div class="panel-footer p-2">
												<button class="btn btn-sm btn-primary" type="button"
														data-toggle="tooltip"
														data-original-title="Send message to user">Message</button>
												<span class="pull-right">
													<button class="btn btn-sm btn-warning" type="button"
															data-toggle="tooltip"
															data-original-title="Edit this user">Edit</button>
													<button class="btn btn-sm btn-danger" type="button"
															data-toggle="tooltip"
															data-original-title="Remove this user">Delete</button>
												</span>
											</div>
										</div>
									</div>
								</div>     
							</div>
							`
							wrapper.innerHTML += item
						}	
					}
				}
				makeManagerSelectable()
			})
		}
	})
	function makeManagerSelectable(){
	
		var managerCards = document.getElementsByClassName("select-manager-button")
		
		for(var i = 0; i < managerCards.length; i++)
		{
			managerCards[i].addEventListener('click', function(){
				
				var userId = this.dataset.id
				var userDepartment = this.dataset.department
				
				if($(this).hasClass( "btn-success" )){           
					addManagerToGroup(userId, projectId, userDepartment)
				}
				else{
					
					deleteManagerToGroup(userId, projectId, userDepartment)
				}	
			})
		}
	}
	function addManagerToGroup(userId ,projectId, userDepartment){
	
		var url = '/api/manager-create-group/'
	
		fetch(url, {
			method:'POST',
			headers:{
				'Content-type': 'application/json',
				'X-CSRFToken':csrftoken,
			},
			body:JSON.stringify({'project_Id':projectId, 'user':userId})
		}
		).then(function(response){
			$("#select-manager-"+userId).removeClass("btn-success")
			$("#select-manager-"+userId).addClass("btn-danger")
			$("#select-manager-"+userId).val("Deselect")
			var tempUser = $("#manager-"+userId)
			$("#manager-"+userId).remove()
			tempUser.appendTo('#v-pills-'+userDepartment+'-selected-manager');
		})
	}
	function deleteManagerToGroup(userId ,projectId, userDepartment){
	
		var url = '/api/manager-group-delete/'+projectId+'/'+userId
	
		fetch(url, {
			method:'DELETE',
			headers:{
				'Content-type': 'application/json',
				'X-CSRFToken':csrftoken,
			},
		}
		).then(function(response){
			$("#select-manager-"+userId).removeClass("btn-danger")
			$("#select-manager-"+userId).addClass("btn-success")
			$("#select-manager-"+userId).val("Select")
			var tempUser = $("#manager-"+userId)
			$("#manager-"+userId).remove()
			tempUser.appendTo('#v-pills-'+userDepartment+'-manager');
		})
	}
}
