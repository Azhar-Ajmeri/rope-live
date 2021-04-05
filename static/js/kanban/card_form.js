var Status_data={};

const editWorkPackageForm = (state, Status_data) =>{
    $('#form-body').html('');
    $('#ModalLabel').html('');

    $('#ModalLabel').append("Edit Workpackage");
    
    $('#form-body').append("<form id='update-form' action='' method='POST'>");
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-6"><input type="text" class="form-control mb-1" name="title" placeholder="title" maxlength="255" id="id_title"></div></div>`);
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-12"><textarea type="text" class="form-control mb-1" name="description" placeholder="description" maxlength="255" id="id_description"></textarea></div></div>`);
    var filterData = Status_data.filter(function (el){
        if(el.state == state)
            return el.title;
    });
    var selectInput=`<div class="form-row"><div class="form-group col-md-6"><select name="emp_status" class="form-control mb-1" required="" id="id_emp_status">`;
    filterData.map((option) => {
        selectInput = selectInput + `<option value="${option.id}">${option.title}</option>`;
    })
    $('#form-body form').append(selectInput+'</select></div></div>');
    $('#form-body form').append(`<div class="form-row"><div class="form-group col-md-6"><input type="number" class="form-control mb-1" name="efforts_planned" placeholder="Planned Efforts" required="" id="id_efforts_planned"></input></div></div>`);
    $('#form-body form').append('<input type="button" class="btn btn-info btn-lg btn-block" id="savebutton" value="Save" />');
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
