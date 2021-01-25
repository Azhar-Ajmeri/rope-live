function cardChangeState(listId, listPriority, list, dragging, packageId, priorityId){
    
    if(parseInt(dragging.dataset.state)+1 == listId || listId == 1 && dragging.dataset.state == 2 
    || dragging.dataset.state == "null" && listId==2 
    || listId == dragging.dataset.state && listId==1 || listId == dragging.dataset.state && listId==2 
    )
    {
        if(listId != 3 && listId != 4)
        {
            $.ajax({
                url: '/api/subWorkPackage-state-update/',
                data: {
                    csrfmiddlewaretoken: csrftoken,
                    id : packageId,
                    state : listId,
                    actual_date : new Date().toISOString().slice(0, 10),
                    priority : listPriority,
                },
                type: 'post',
                success: function(){
                    list.appendChild(dragging);
                    dragging.dataset.state = listId;
                    dragging.dataset.priority = listPriority;
                    $('#cover-spin').hide(0);
                },
                error: function(){
                    $('#cover-spin').hide(0);
                }
            })
        }
        else if(listId == 3 && dragging.dataset.state == 2 && priorityId == listPriority 
            || listId == 4 && dragging.dataset.state == 3 && priorityId == listPriority){
            
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
                                state : listId,
                                actual_date : new Date().toISOString().slice(0, 10),
                                priority : listPriority,
                            },
                            type: 'post',
                            success: function(){
                                list.appendChild(dragging);
                                dragging.dataset.state = listId;
                                dragging.dataset.priority = listPriority;
                                $('#cover-spin').hide(0);
                            },
                            error: function(){
                                $('#cover-spin').hide(0);
                            }
                        })
                    }
                }
            })
        }
        else{
            var wrapper = document.getElementById('message_content');
            wrapper.innerHTML =''	
            $('#message_container').show(0);
            wrapper.innerHTML = "Can't change priority!"
            $('#cover-spin').hide(0);
        }
    }
    else if(listId == 2 && dragging.dataset.state == 3){
        console.log("You need to specify the reason")
        $.ajax({
            url: '/api/subWorkPackage-state-update/',
            data: {
                csrfmiddlewaretoken: csrftoken,
                id : packageId,
                state : listId,
                actual_date : new Date().toISOString().slice(0, 10),
                priority : listPriority,
            },
            type: 'post',
            success: function(){
                list.appendChild(dragging);
                dragging.dataset.state = 2;
                dragging.dataset.priority = listPriority;
                $('#cover-spin').hide(0);
            },
            error: function(){
                $('#cover-spin').hide(0);
            }
        })
    }
    else{
        var wrapper = document.getElementById('message_content');
        wrapper.innerHTML =''	
        $('#message_container').show(0);
        wrapper.innerHTML = "Can't move completed cards!"
        $('#cover-spin').hide(0);
    }
}