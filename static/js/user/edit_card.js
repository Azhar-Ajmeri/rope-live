$("#blurEditForm").hide()
$("#Loader-spin").hide()

//Get project values for Editing Ajax function
$("#taskCardContainer").on('click','.editButtonSWPClass',function(){
    swpID = $(this).data('id');
    swpSTATE = document.getElementById(swpID).dataset.state

    $("#blurEditForm").show()
    $("#Loader-spin").show()

    $.ajax({
        url: '/projects/'+ swpID +'/getSubworkpackageFormValues/',
        data: {
            csrfmiddlewaretoken: csrftoken,
            Id: swpID
        },
        type: 'post',    
        success: function(response){
            $("#editSWPForm")[0].reset();
            console.log(response)
            document.getElementById("id_title").defaultValue = response.field.title;

            if(response.field.description != null){document.getElementById("id_description").defaultValue = response.field.description;}
            else{document.getElementById("id_description").defaultValue = "";}

            if(response.field.date_of_start != null){document.getElementById("id_date_of_start").defaultValue = response.field.date_of_start;}
            else{document.getElementById("id_date_of_start").defaultValue = "";}

            if(response.field.date_of_end != null){document.getElementById("id_date_of_end").defaultValue = response.field.date_of_end;}
            else{document.getElementById("id_date_of_end").defaultValue = "";}

            if(response.field.efforts_planned != null){document.getElementById("id_efforts_planned").defaultValue = response.field.efforts_planned;}
            else{document.getElementById("id_efforts_planned").defaultValue = "";}
            
            $("#id_priority").val( response.field.priority );
            
            if(swpSTATE == 3){
                $("#id_title").prop('disabled', true);
                $("#id_date_of_start").prop('disabled', true);
                $("#id_date_of_end").prop('disabled', true);
                $("#id_efforts_planned").prop('disabled', true);
                $("#id_priority").prop('disabled', true);
            }
            else if(swpSTATE == 4){
                $("#id_title").prop('disabled', true);
                $("#id_description").prop('disabled', true);
                $("#id_date_of_start").prop('disabled', true);
                $("#id_date_of_end").prop('disabled', true);
                $("#id_efforts_planned").prop('disabled', true);
                $("#id_priority").prop('disabled', true);
            }
            else{
                $("#id_title").prop('disabled', false);
                $("#id_description").prop('disabled', false);
                $("#id_date_of_start").prop('disabled', false);
                $("#id_date_of_end").prop('disabled', false);
                $("#id_efforts_planned").prop('disabled', false);
                $("#id_priority").prop('disabled', false);
            }

            console.log(response.field.priority)
            $("#blurEditForm").hide()
            $("#Loader-spin").hide()
        }
    
    });
});

//Ajax edit project form submission
$('#editModalButton').click(function(){
    var serializedData = $("#editSWPForm").serialize();
    console.log(serializedData)
    $.ajax({
        url: '/api/subWorkPackage-update/'+swpID+'/',
        data: serializedData,
        type: 'post',

        success: function(response){
            document.getElementById(response.subSubWorkPackage.id+"-taskTitle").innerHTML = response.subSubWorkPackage.title;

            document.getElementById(response.subSubWorkPackage.id+"-taskDescription").innerHTML = response.subSubWorkPackage.description+"";
        }
    });

    $("#editSWPForm")[0].reset();
	document.getElementById('editModalDismissButton').click();
});

//Delete card
$("#taskCardContainer").on('click','.deleteButtonSWPClass',function(){
    swpID = $(this).data('id');
    swpSTATE = document.getElementById(swpID).dataset.state;
    
    if(swpSTATE == 1 || swpSTATE == 2)
    {
        fetch('/api/subWorkPackage-delete/'+swpID+'/', {
            method:'DELETE',
            headers:{
                'Content-type':'application/json',
                'X-CSRFToken':csrftoken,
                }
        }).then((response) => {
            $("#"+swpID).remove();
        })
    }
    else if(swpSTATE == 3)
    {
        var wrapper = document.getElementById('message_content');
        wrapper.innerHTML =''	
        $('#message_container').show(0);
        wrapper.innerHTML = "Can't delete card in Progress state, to delete move back to defined state."
    }
    else if(swpSTATE == 4)
    {
        var wrapper = document.getElementById('message_content');
        wrapper.innerHTML =''	
        $('#message_container').show(0);
        wrapper.innerHTML = "Can't delete card in completed state"
    }
})