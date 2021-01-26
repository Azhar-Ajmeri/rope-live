myProjectsList()
function myProjectsList(){
	var url = '/api/project-list/';

	fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
		projectList = data
		var options = ''
		for(var i in projectList){
			options += `<option value="`+projectList[i].id+`">`+projectList[i].title+`</option>`
		}
		
		project_selection_list =
		`
		<div class="form-group col-md-2">
			<label for="id_title">Project:</label>
			<select name="dropdown" class="form-control" id="selectedProject">
			`+ options +`
			</select>
		</div>
		<div class="form-group col-md-10">
		</div>
		`
		$('#project_selection').append(project_selection_list)
		$('select[id="selectedProject"]').change(function(){
			SwpVsUserChart()
			SwpVsStatusChart()
			startVsEndPlannedDateChart()	
			startVsEndActualDateChart()
		})
		SwpVsUserChart()
		SwpVsStatusChart()
		startVsEndPlannedDateChart();
		startVsEndActualDateChart();
		WeekByStatusChart();
	})
}

function SwpVsUserChart(){
    project_Id = $('select[id="selectedProject"]').val()
	$.ajax({
        url: '/api/user-swp-count/'+project_Id+'/',
        data: {
			csrfmiddlewaretoken: csrftoken,
		},
		type: 'post',

        success: function(response){
			var user = []
			var swpCount = []
		
			for(var i = 0; i < response.length; i++)
			{
				user.push(response[i].first_name+" "+response[i].last_name);
				swpCount.push(response[i].package_count);
			}

			SwpVsUser.data.labels = user;
			SwpVsUser.data.datasets[0].data = swpCount;
			SwpVsUser.update();

        }
    });
}


function SwpVsStatusChart(){
    project_Id = $('select[id="selectedProject"]').val()
	$.ajax({
        url: '/api/status-swp-count/'+project_Id+'/',
        data: {
			csrfmiddlewaretoken: csrftoken,
		},
		type: 'post',

        success: function(response){
			var status = []
			var swpCount = []
			for(var i = 0; i < response.length; i++)
			{
				status.push(response[i].title);
				swpCount.push(response[i].package_count);
			}
			
			SwpVsStatus.data.labels = status;
			SwpVsStatus.data.datasets[0].data = swpCount;
			SwpVsStatus.update();
		}
    });
}

function startVsEndPlannedDateChart(){
    project_Id = $('select[id="selectedProject"]').val()

	fetch('/api/project-start-date/'+project_Id+'/')
	.then((resp) => resp.json())
	.then(function(data){
		project_date = data;
	})
	.then(function(){
		fetch('/api/planned-start-date-swp/'+project_Id+'/')
		.then((resp) => resp.json())
		.then(function(data){
			start_date = data;
		})
		.then(function(){
			fetch('/api/planned-end-date-swp/'+project_Id+'/')
			.then((resp) => resp.json())
			.then(function(data){
				end_date = data;
				
				var dateMain = [];
				var start_data = [];
				var end_data = [];

				var week = Number(moment(project_date[0].date_of_creation).format('W'))
				var year = Number(moment(project_date[0].date_of_creation).format('YYYY'))

				if(week >= 52 && Number(moment(project_date[0].date_of_creation).format('MM')) == 1)
				{
					year = year - 1;
				}
				else if(week == 1 && Number(moment(project_date[0].date_of_creation).format('MM')) == 12)
				{
					year = year + 1;
				}
				
				var m = moment(year+'-12-31', 'YYYY-MM-DD');
				var max_week = m.format('W');
				max_week = Number(max_week);

				if(max_week == 1){
					max_week = 52;
				}

				if(moment(end_date[end_date.length-1].date_of_end).isSameOrAfter(start_date[start_date.length-1].date_of_start))
				{
					last_week = Number(moment(end_date[end_date.length-1].date_of_end).format('WW'));
					last_year = Number(moment(end_date[end_date.length-1].date_of_end).format('YYYY'));
				}
				else{
					last_week = Number(moment(start_date[start_date.length-1].date_of_start).format('WW'));
					last_year = Number(moment(start_date[start_date.length-1].date_of_start).format('YYYY'));
				}
				

				if(last_week >= 52 && Number(moment(end_date[end_date.length-1].date_of_end).format('MM')) == 1)
				{
					last_year = last_year - 1;
				}
				else if(last_week == 1 && Number(moment(end_date[end_date.length-1].date_of_end).format('MM')) == 12)
				{
					last_year = last_year + 1;
				}
				
				while(true){
				
					if(year > last_year
					|| year == last_year
					&& week > last_week
					)
					{
						break;
					}

					dateMain.push(year+'_'+week);
					start_data.push(0);
					end_data.push(0);

					if(week >= max_week)
					{
						week = 1;
						year = year + 1;

						m = moment(year+'-12-31', 'YYYY-MM-DD');
						max_week = m.format('W');
						max_week = Number(max_week);

						if(max_week == 1){
							max_week = 52;
						}
					}
					else
					{
						week = week + 1;
					}
				}
				var cmm_total = 0
				for(var i = 0; i < start_date.length; i++)
				{
					if(moment(start_date[i].date_of_start).isSameOrAfter(project_date[0].date_of_creation))
					{
						var week = Number(moment(start_date[i].date_of_start).format('W'));
						var year = Number(moment(start_date[i].date_of_start).format('YYYY'));

						if(week >= 52 && Number(moment(start_date[i].date_of_start).format('MM')) == 1)
						{
							year = year - 1;
						}
						else if(week == 1 && Number(moment(start_date[i].date_of_start).format('MM')) == 12)
						{
							year = year + 1;
						}
						var dateIndex = dateMain.indexOf(year+'_'+week);

						cmm_total = cmm_total + 1;
						start_data[dateIndex] = cmm_total;
					}
				}
				for(var i = 1; i < start_data.length; i++)
				{
					if(start_data[i]==0){
						if(start_data[i-1] != 0){
							start_data[i] = start_data[i-1];
						}
					}
				}

				cmm_total = 0;
				for(var i = 0; i < end_date.length; i++)
				{
					if(moment(end_date[i].date_of_end).isSameOrAfter(project_date[0].date_of_creation))
					{
						var week = Number(moment(end_date[i].date_of_end).format('W'));
						var year = Number(moment(end_date[i].date_of_end).format('YYYY'));

						if(week >= 52 && Number(moment(end_date[i].date_of_end).format('MM')) == 1)
						{
							year = year - 1;
						}
						else if(week == 1 && Number(moment(end_date[i].date_of_end).format('MM')) == 12)
						{
							year = year + 1;
						}
						var dateIndex = dateMain.indexOf(year+'_'+week);

						cmm_total = cmm_total + 1;
						end_data[dateIndex] = cmm_total;
					}
				}
				for(var i = 1; i < end_data.length; i++)
				{
					if(end_data[i]==0){
						if(end_data[i-1] != 0){
							end_data[i] = end_data[i-1];
						}
					}
				}

				StartDateByKW.data.labels = dateMain;
                StartDateByKW.data.datasets[0].data = start_data;
                StartDateByKW.data.datasets[1].data = end_data;
                StartDateByKW.update();
			})
		})
	})
}


function startVsEndActualDateChart(){
    project_Id = $('select[id="selectedProject"]').val()
	actual_start_date = ''
	actual_end_date = ''
	project_actual_date = ''
	
	fetch('/api/project-start-date/'+project_Id+'/')
	.then((resp) => resp.json())
	.then(function(data){
		project_actual_date = data;
	})
	.then(function(){
		fetch('/api/actual-start-date-swp/'+project_Id+'/')
		.then((resp) => resp.json())
		.then(function(data){
			actual_start_date = data;
		})
		.then(function(){
			fetch('/api/actual-end-date-swp/'+project_Id+'/')
			.then((resp) => resp.json())
			.then(function(data){
				actual_end_date = data;

				var dateMain = []
				var start_data = []
				var end_data = []

				var week = Number(moment(project_actual_date[0].date_of_creation).format('W'))
				var year = Number(moment(project_actual_date[0].date_of_creation).format('YYYY'))

				if(week >= 52 && Number(moment(project_actual_date[0].date_of_creation).format('MM')) == 1)
				{
					year = year - 1;
				}
				else if(week == 1 && Number(moment(project_actual_date[0].date_of_creation).format('MM')) == 12)
				{
					year = year + 1;
				}
				
				var m = moment(year+'-12-31', 'YYYY-MM-DD');
				var max_week = m.format('W');
				max_week = Number(max_week);

				if(max_week == 1){
					max_week = 52;
				}

				if(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).isSameOrAfter(actual_start_date[actual_start_date.length-1].actual_date_of_start))
				{
					last_week = Number(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).format('WW'));
					last_year = Number(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).format('YYYY'));
				}
				else{					
					last_week = Number(moment(actual_start_date[actual_start_date.length-1].actual_date_of_start).format('WW'));
					last_year = Number(moment(actual_start_date[actual_start_date.length-1].actual_date_of_start).format('YYYY'));
				}

				if(last_week >= 52 && Number(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).format('MM')) == 1)
				{
					last_year = last_year - 1;
				}
				else if(last_week == 1 && Number(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).format('MM')) == 12)
				{
					last_year = last_year + 1;
				}
				
				while(true){
				
					if(year > last_year
					|| year == last_year
					&& week > last_week
					)
					{
						break;
					}

					dateMain.push(year+'_'+week);
					start_data.push(0);
					end_data.push(0);

					if(week >= max_week)
					{
						week = 1;
						year = year + 1;

						m = moment(year+'-12-31', 'YYYY-MM-DD');
						max_week = m.format('W');
						max_week = Number(max_week);

						if(max_week == 1){
							max_week = 52;
						}
					}
					else
					{
						week = week + 1;
					}
				}

				var cmm_total = 0;
				for(var i = 0; i < actual_start_date.length; i++)
				{
					if(moment(actual_start_date[i].actual_date_of_start).isSameOrAfter(project_actual_date[0].date_of_creation))
					{
						var week = Number(moment(actual_start_date[i].actual_date_of_start).format('W'));
						var year = Number(moment(actual_start_date[i].actual_date_of_start).format('YYYY'));

						if(week >= 52 && Number(moment(actual_start_date[i].actual_date_of_start).format('MM')) == 1)
						{
							year = year - 1;
						}
						else if(week == 1 && Number(moment(actual_start_date[i].actual_date_of_start).format('MM')) == 12)
						{
							year = year + 1;
						}
						var dateIndex = dateMain.indexOf(year+'_'+week);

						cmm_total = cmm_total + 1;
						start_data[dateIndex] = cmm_total;
					}
				}
				for(var i = 1; i < start_data.length; i++)
				{
					if(start_data[i]==0){
						if(start_data[i-1] != 0){
							start_data[i] = start_data[i-1];
						}
					}
				}
				cmm_total = 0;
				for(var i = 0; i < actual_end_date.length; i++)
				{
					if(moment(actual_end_date[i].actual_date_of_end).isSameOrAfter(project_actual_date[0].date_of_creation))
					{
						var week = Number(moment(actual_end_date[i].actual_date_of_end).format('W'));
						var year = Number(moment(actual_end_date[i].actual_date_of_end).format('YYYY'));

						if(week >= 52 && Number(moment(actual_end_date[i].actual_date_of_end).format('MM')) == 1)
						{
							year = year - 1;
						}
						else if(week == 1 && Number(moment(actual_end_date[i].actual_date_of_end).format('MM')) == 12)
						{
							year = year + 1;
						}
						var dateIndex = dateMain.indexOf(year+'_'+week);
						cmm_total = cmm_total + 1;
						end_data[dateIndex] = cmm_total;
					}
				}
				for(var i = 1; i < end_data.length; i++)
				{
					if(end_data[i]==0){
						if(end_data[i-1] != 0){
							end_data[i] = end_data[i-1];
						}
					}
				}
				
				ActualStartDateByKW.data.labels = dateMain;
                ActualStartDateByKW.data.datasets[0].data = start_data;
                ActualStartDateByKW.data.datasets[1].data = end_data;
				ActualStartDateByKW.update();
				
			})
		})
	})
}

function WeekByStatusChart(){
    project_Id = $('select[id="selectedProject"]').val()
	$.ajax({
        url: '/api/status-swp-weekly/'+project_Id+'/',
        data: {
			csrfmiddlewaretoken: csrftoken,
		},
		type: 'post',

        success: function(response){
			
			fetch('/api/project-start-date/'+project_Id+'/')
			.then((resp) => resp.json())
			.then(function(data){
				project_date = data;

				dateMain = []
				state1weekcount = []
				state2weekcount = []
				state3weekcount = []
				state4weekcount = []

				var week = Number(moment(project_date[0].date_of_creation).format('W'))
				var year = Number(moment(project_date[0].date_of_creation).format('YYYY'))

				if(week >= 52 && Number(moment(project_date[0].date_of_creation).format('MM')) == 1)
				{
					year = year - 1;
				}
				else if(week == 1 && Number(moment(project_date[0].date_of_creation).format('MM')) == 12)
				{
					year = year + 1;
				}
				
				var m = moment(year+'-12-31', 'YYYY-MM-DD');
				var max_week = m.format('W');
				max_week = Number(max_week);

				if(max_week == 1){
					max_week = 52;
				}
				
				var total_weeks = 5;
				var i = 0;

				while(i<total_weeks){
					i += 1;
					dateMain.push(year+'_'+week);
					state1weekcount.push(0);
					state2weekcount.push(0);
					state3weekcount.push(0);
					state4weekcount.push(0);

					if(week >= max_week)
					{
						week = 1;
						year = year + 1;

						m = moment(year+'-12-31', 'YYYY-MM-DD');
						max_week = m.format('W');
						max_week = Number(max_week);

						if(max_week == 1){
							max_week = 52;
						}
					}
					else
					{
						week = week + 1;
					}
				}
				
				for(var i = 0; i < dateMain.length; i++)
				{
					for(var j = 0; j < response.length; j++)
					{
						if(moment(response[j].date_of_state4).isSameOrAfter(project_date[0].date_of_creation))
						{
							var week = Number(moment(response[j].date_of_state4).format('W'));
							var year = Number(moment(response[j].date_of_state4).format('YYYY'));

							if(week >= 52 && Number(moment(response[j].date_of_state4).format('MM')) == 1)
							{
								year = year - 1;
							}
							else if(week == 1 && Number(moment(response[i].date_of_state4).format('MM')) == 12)
							{
								year = year + 1;
							}
							var thisweek = year+"_"+week
							if(thisweek == dateMain[i])
							{
								state4weekcount[i] += 1;
							}
						}
					
						if(moment(response[j].date_of_state3).isSameOrAfter(project_date[0].date_of_creation))
						{
							var week = Number(moment(response[j].date_of_state3).format('W'));
							var year = Number(moment(response[j].date_of_state3).format('YYYY'));

							if(week >= 52 && Number(moment(response[j].date_of_state3).format('MM')) == 1)
							{
								year = year - 1;
							}
							else if(week == 1 && Number(moment(response[i].date_of_state3).format('MM')) == 12)
							{
								year = year + 1;
							}
							var thisweek = year+"_"+week
							if(thisweek == dateMain[i])
							{
								state3weekcount[i] += 1;
							}
						}
					
						if(moment(response[j].date_of_state2).isSameOrAfter(project_date[0].date_of_creation))
						{
							var week = Number(moment(response[j].date_of_state2).format('W'));
							var year = Number(moment(response[j].date_of_state2).format('YYYY'));

							if(week >= 52 && Number(moment(response[j].date_of_state2).format('MM')) == 1)
							{
								year = year - 1;
							}
							else if(week == 1 && Number(moment(response[i].date_of_state2).format('MM')) == 12)
							{
								year = year + 1;
							}
							var thisweek = year+"_"+week
							if(thisweek == dateMain[i])
							{
								state2weekcount[i] += 1;
							}
						}
					
						if(moment(response[j].date_of_state1).isSameOrAfter(project_date[0].date_of_creation))
						{
							var week = Number(moment(response[j].date_of_state1).format('W'));
							var year = Number(moment(response[j].date_of_state1).format('YYYY'));

							if(week >= 52 && Number(moment(response[j].date_of_state1).format('MM')) == 1)
							{
								year = year - 1;
							}
							else if(week == 1 && Number(moment(response[i].date_of_state1).format('MM')) == 12)
							{
								year = year + 1;
							}
							var thisweek = year+"_"+week
							if(thisweek == dateMain[i])
							{
								state1weekcount[i] += 1;
							}
						}
					}
					if(i != 0){
						state2weekcount[i] = state2weekcount[i] + state2weekcount[i-1] - state3weekcount[i];
						state3weekcount[i] = state3weekcount[i] + state3weekcount[i-1] - state4weekcount[i];
						state4weekcount[i] += state4weekcount[i-1];
					}
					state1weekcount[i] = response.length - state2weekcount[i] - state3weekcount[i] - state4weekcount[i];
				}
				
				WeekByStatus.data.labels = dateMain;
				WeekByStatus.data.datasets[0].data = state1weekcount;
				WeekByStatus.data.datasets[1].data = state2weekcount;
				WeekByStatus.data.datasets[2].data = state3weekcount;
				WeekByStatus.data.datasets[3].data = state4weekcount;
				WeekByStatus.update();
				
			})
		}
    });
}