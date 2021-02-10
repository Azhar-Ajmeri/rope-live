function cardChangeState(list, dragging, packageId){
    console.log("packageId", packageId)
    console.log("list", list.dataset.state)
    console.log("dragging", dragging.dataset.state)
    $('#cover-spin').hide(0);

    if( (parseInt(dragging.dataset.state)+1) == list.dataset.state)
    {
        console.log("here")
        if(list.dataset.state != 3 && list.dataset.state != 4)
        {
            $.ajax({
                url: '/api/subWorkPackage-state-update/',
                data: {
                    csrfmiddlewaretoken: csrftoken,
                    id : packageId,
                    state : list.dataset.state,
                    actual_date : new Date().toISOString().slice(0, 10),
                },
                type: 'post',
                success: function(){
                    list.appendChild(dragging);
                    dragging.dataset.state = list.dataset.state;
                    $('#cover-spin').hide(0);
                },
                error: function(){
                    $('#cover-spin').hide(0);
                }
            })
        }
        else if(list.dataset.state == 3 || list.dataset.state == 4)
        {
            console.log("here")
            $.ajax({
                url: '/projects/'+ packageId +'/getSubworkpackageFormValues/',
                data: {
                    csrfmiddlewaretoken: csrftoken,
                    Id: packageId
                },
                type: 'post',    
                success: function(response){            
                    if(response.field.date_of_start == null || response.field.date_of_end == null || response.field.efforts_planned == null){
                        var wrapper = document.getElementById('message_content');
                        wrapper.innerHTML =''	
                        $('#message_container').show(0);
                        wrapper.innerHTML = "Please fill required fields"
                        $('#cover-spin').hide(0);
                        return;
                    }
                    else{
                        $.ajax({
                            url: '/api/subWorkPackage-state-update/',
                            data: {
                                csrfmiddlewaretoken: csrftoken,
                                id : packageId,
                                state : list.dataset.state,
                                actual_date : new Date().toISOString().slice(0, 10),
                            },
                            type: 'post',
                            success: function(){
                                list.appendChild(dragging);
                                dragging.dataset.state = list.dataset.state;
                                $('#cover-spin').hide(0);
                            },
                            error: function(){
                                var wrapper = document.getElementById('message_content');
                                wrapper.innerHTML =''	
                                $('#message_container').show(0);
                                wrapper.innerHTML = "Failed to move!"
                                $('#cover-spin').hide(0);
                            }
                        })
                    }
                }
            })
        }
    }
    else if((parseInt(dragging.dataset.state)-1) == list.dataset.state)
        {
            console.log("wjsd")
            $.ajax({
                url: '/api/subWorkPackage-state-update/',
                data: {
                    csrfmiddlewaretoken: csrftoken,
                    id : packageId,
                    state : list.dataset.state,
                    actual_date : new Date().toISOString().slice(0, 10),
                },
                type: 'post',
                success: function(){
                    list.appendChild(dragging);
                    dragging.dataset.state = list.dataset.state;
                    $('#cover-spin').hide(0);
                },
                error: function(){
                    $('#cover-spin').hide(0);
                }
            })
        }
}