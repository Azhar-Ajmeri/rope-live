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

var ctx = document.getElementById('SwpVsUser').getContext('2d');
SwpVsUser = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: [],
		datasets: [{
			label: 'No of Subworkpackages vs Responsible',
			data: [],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
});

var ctx = document.getElementById('SwpVsStatus').getContext('2d');
SwpVsStatus = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: [],
		datasets: [{
			label: 'No of Sub workpackage vs Status',
			data: [],
			backgroundColor: [
				'rgba(119, 194, 254, 0.2)',
				'rgba(36, 156, 255, 0.2)',
				'rgba(10, 87, 158, 0.2)',
				'rgba(0, 56, 112, 0.2)',
			],
			borderColor: [
				'rgba(119, 194, 254, 1)',
				'rgba(36, 156, 255, 1)',
				'rgba(10, 87, 158, 1)',
				'rgba(0, 56, 112, 1)',
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero: true
				}
			}]
		}
	}
});


var ctx = document.getElementById("StartDateByKW").getContext('2d');

StartDateByKW = new Chart(ctx, {
	type: 'line',
	label:'he',
	data: {
		labels: [],
		datasets: [{
			label: 'Start Planned Date', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#2196f3', // Add custom color border (Line)
			backgroundColor: 'rgba(130, 238, 253, 0.1)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		},
		{
			label: 'End Planned Date', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#9621f3', // Add custom color border (Line)
			backgroundColor: 'rgba(236, 151, 6, 0.1)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		}]
	},
	options: {
	responsive: true, // Instruct chart js to respond nicely.
	maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
	}
});

var ctx = document.getElementById("ActualStartDateByKW").getContext('2d');
				
ActualStartDateByKW = new Chart(ctx, {
	type: 'line',
	label:'he',
	data: {
		labels: [],
		datasets: [{
			label: 'Actual Start Date', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#2196f3', // Add custom color border (Line)
			backgroundColor: 'rgba(57, 68, 188, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		},
		{
			label: 'Actual End Date', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#9621f3', // Add custom color border (Line)
			backgroundColor: 'rgba(221, 87, 28, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		}]
	},
	options: {
	responsive: true, // Instruct chart js to respond nicely.
	maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
	}
});


var ctx = document.getElementById("WeekByStatus").getContext('2d');
				
WeekByStatus = new Chart(ctx, {
	type: 'line',
	label:'he',
	data: {
		labels: [],
		datasets: [{
			label: 'To Be Defined', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#2196f3', // Add custom color border (Line)
			backgroundColor: 'rgba(255, 99, 132, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		},
		{
			label: 'Defined', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#9621f3', // Add custom color border (Line)
			backgroundColor: 'rgba(153, 102, 255, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		},
		{
			label: 'In Progress', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#9621f3', // Add custom color border (Line)
			backgroundColor: 'rgba(255, 159, 64, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		},
		{
			label: 'Completed', // Name the series
			data: [], // Specify the data values array
			fill: true,
			borderColor: '#9621f3', // Add custom color border (Line)
			backgroundColor: 'rgba(75, 192, 192, 0.2)', // Add custom color background (Points and Fill)
			borderWidth: 1 // Specify bar border width
		}]
	},
	options: {
	responsive: true, // Instruct chart js to respond nicely.
	maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
	}
});