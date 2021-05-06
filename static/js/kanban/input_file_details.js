$("#taskCardContainer").on('click','.input-file-Fields',function(){
	id = $(this).data('id');
    var url = '/api/workpackage-details/'+id+'/'
    fetch(url)
    .then((resp) => resp.json())
    .then(function(data){
        id = data.inputFrom
        if(id != null)
        {
            var url = '/api/workpackage-details/'+id+'/'
            fetch(url)
            .then((resp) => resp.json())
            .then(function(data){
                $('#input_File_details').html('');
                $('#input_File_details').append(`
                    <div class="row">
                        <div class="col-12">
                            <b>Input Workpackage title:</b> ${data.title}
                        </div>
                        <div class="col-12">
                            <b>url:</b> <a href=${data.inputFile} target="_blank" style="color:blue">${data.inputFile}</a>
                        </div>
                    </div>
                `)
            });
        }
        else
        {
            $('#input_File_details').html('');
                $('#input_File_details').append(`
                    No Input File Available
                `)
        }
    });
});