Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    var year, month, date;
    while (currentDate <= stopDate) {
        date_obj = new Date (currentDate);
        year = date_obj.getFullYear();
        month = (date_obj.getMonth()+1)+"";
        date = date_obj.getDate()+"";
        if(month.length == 1)
            month = "0"+month
        if(date.length == 1)
            date = "0"+date
        dateArray.push(year+"-"+month+"-"+date);
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function startVsEndPlannedDateChart_date(){
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

                if(moment(end_date[end_date.length-1].date_of_end).isSameOrAfter(start_date[start_date.length-1].date_of_start))
				{
					var ed = new Date(end_date[end_date.length-1].date_of_end);
				}
				else{
					var ed = new Date(start_date[start_date.length-1].date_of_start);
				}
                sd = new Date(project_date[0].date_of_creation);

                var dateMain = getDates(sd, ed);
                var start_data = new Array(dateMain.length).fill(0);
                var end_data = new Array(dateMain.length).fill(0);
                
                var cmm_total = 0
				for(var i = 0; i < start_date.length; i++)
				{
					if(moment(start_date[i].date_of_start).isSameOrAfter(project_date[0].date_of_creation))
					{
                        var dateIndex = dateMain.indexOf(start_date[i].date_of_start);
                        if(dateIndex != -1)
						{
                            cmm_total = cmm_total + 1;
                            start_data[dateIndex] = cmm_total;
                        }
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
                        var dateIndex = dateMain.indexOf(end_date[i].date_of_end);
                        if(dateIndex != -1)
						{
                            cmm_total = cmm_total + 1;
                            end_data[dateIndex] = cmm_total;
                        }
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

function startVsEndActualDateChart_date(){
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

                if(moment(actual_end_date[actual_end_date.length-1].actual_date_of_end).isSameOrAfter(actual_start_date[actual_start_date.length-1].actual_date_of_start))
				{
					var ed = new Date(actual_end_date[actual_end_date.length-1].actual_date_of_end);
				}
				else{
					var ed = new Date(actual_start_date[actual_start_date.length-1].actual_date_of_start);
				}
                sd = new Date(project_date[0].date_of_creation);

                var dateMain = getDates(sd, ed);
                var start_data = new Array(dateMain.length).fill(0);
                var end_data = new Array(dateMain.length).fill(0);
                
                var cmm_total = 0
				for(var i = 0; i < actual_start_date.length; i++)
				{
					if(moment(actual_start_date[i].actual_date_of_start).isSameOrAfter(project_date[0].date_of_creation))
					{
                        var dateIndex = dateMain.indexOf(actual_start_date[i].actual_date_of_start);
                        if(dateIndex != -1)
						{
                            cmm_total = cmm_total + 1;
                            start_data[dateIndex] = cmm_total;
                        }
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
					if(moment(actual_end_date[i].actual_date_of_end).isSameOrAfter(project_date[0].date_of_creation))
					{
                        var dateIndex = dateMain.indexOf(actual_end_date[i].actual_date_of_end);
                        if(dateIndex != -1)
						{
                            cmm_total = cmm_total + 1;
                            end_data[dateIndex] = cmm_total;
                        }
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