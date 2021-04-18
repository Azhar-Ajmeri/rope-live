var Status_data={};
var User_list={};
$('.inner-list').sortable({
    axis: 'x',
});
const editWorkPackageForm = (state, Status_data) =>{
    $('#form-body').html('');
    $('#ModalLabel').html('');

    $('#ModalLabel').append("Edit Workpackage");
    
    $('#form-body').append("<form id='update-form' action='' method='POST'>");
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-4">Title : </div><div class="form-group col-md-6"><input type="text" class="form-control mb-1" name="title" placeholder="title" maxlength="255" id="id_title"></div></div>`);
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-4">Description : </div><div class="form-group col-md-8"><textarea type="text" class="form-control mb-1" name="description" placeholder="description" maxlength="255" id="id_description"></textarea></div></div>`);
    var filterData = Status_data.filter(function (el){
        if(el.state == state)
            return el.title;
    });
    if(user_type == 2)
        var selectInput=`<div class="form-row"><div class="form-group col-md-4">Status : </div><div class="form-group col-md-6"><select name="manager_status" class="form-control mb-1" required="" id="id_manager_status">`;
    else
        var selectInput=`<div class="form-row"><div class="form-group col-md-4">Status : </div><div class="form-group col-md-6"><select name="emp_status" class="form-control mb-1" required="" id="id_emp_status">`;
    
    
    filterData.map((option) => {
        selectInput = selectInput + `<option value="${option.id}">${option.title}</option>`;
    });
    $('#form-body form').append(selectInput+'</select></div></div>');
    var selectInput=`<div class="form-row"><div class="form-group col-md-4">Responsible : </div><div class="form-group col-md-6"><select name="responsible" class="form-control mb-1" required="" id="id_responsible">`;
    User_list.map((option) => {
        selectInput = selectInput + `<option value="${option.id}">${option.name}</option>`;
    });
    $('#form-body form').append(selectInput+'</select></div></div>');
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-4">Planned Start Date : </div><div class="form-group col-md-6"><input type="date" class="form-control mb-1" name="planned_date_of_start" placeholder="Planned Start Date" required="" id="id_planned_date_of_start"></input></div></div>`);
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-4">Planned End Date : </div><div class="form-group col-md-6"><input type="date" class="form-control mb-1" name="planned_date_of_end" placeholder="Planned End Date" required="" id="id_planned_date_of_end"></input></div></div>`);
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-4">Planned Efforts : </div><div class="form-group col-md-6"><input type="number" class="form-control mb-1" name="efforts_planned" placeholder="Planned Efforts" required="" id="id_efforts_planned"></input></div></div>`);
    if(user_type != 1)
    {
        $('#form-body form').append('<input type="button" class="btn btn-info btn-lg btn-block" id="savebutton" value="Save" />');
    }
    else{
        $("#update-form :input").prop("disabled", true);
    }
    $("#blurEditForm").hide();
    $("#Loader-spin").hide();
}

const fetch_status = () =>{
    var url = '/api/status/'
    fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
        Status_data = data;
    });
}
fetch_status();

const fetch_user_List = () =>{
    var url = '/api/user-profile-list/'
    fetch(url)
	.then((resp) => resp.json())
	.then(function(data){
        User_list = data;
    });
}
fetch_user_List();