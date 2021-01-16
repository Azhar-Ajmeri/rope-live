function dragFunction(){
    //Columns droppable selector
    const lists = document.querySelectorAll('.list');
    
    //Looping through droppable columns
    for (let j = 0; j < lists.length; j ++) {
        const list = lists[j];
    
        draggable = document.querySelectorAll('.list-item')
            draggable.forEach(draggable => {
                draggable.addEventListener('dragstart', function() {
                    this.classList.add('dragging')
                    packageId = this.dataset.id;
                    stateId = this.dataset.state;
                    priorityId = this.dataset.priority;
                })
    
                draggable.addEventListener('dragend', function() {
                    this.classList.remove('dragging')
                })
            })
    
            list.addEventListener('dragover', function(e) {
                e.preventDefault();
                
    
            })
            list.addEventListener('drop', function(e) {
                e.preventDefault();
                dragging = document.querySelector('.dragging');
                $('#cover-spin').show(0);
                cardChangeState(list.dataset.id, list.dataset.priority, list, dragging, packageId, priorityId)
            })
        }
    }