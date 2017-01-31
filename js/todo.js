$(function () {
    var tasks = JSON.parse(localStorage.getItem('todoTasks'));
    if (tasks == null) {
        tasks = [];
        localStorage.setItem('todoTasks', '[]');
    } else {
        for (var i in tasks) {
            addToList(tasks[i]);
        }
    }
    updateMarkers();

    $('#new-task-form').submit(function () {
        var task = $('#new-task-input').val();
        $('#new-task-input').val("");
        addToList(task);
        updateMarkers();
        updateStorage();
        return false;
    });

    $('input[name="mark-all"]').change(function () {
        var checked = $(this).is(':checked');
        $('input[name="done"]').each(function () {
            $(this).prop('checked', checked);
            strike(this);
        });
        updateMarkers();
    });

    $('#delete-all').click(function () {
        $('input[name="done"]:checked').each(function () {
            $(this).parent().remove();
        });
        updateMarkers();
        updateStorage();
    });
});

$(document).delegate('button[name="delete-task"]', 'click', function () {
    $(this).parent().remove();
    updateMarkers();
    updateStorage();
});

$(document).delegate('input[name="done"]', 'change', function () {
    strike(this);
    updateMarkers();
});

function addToList(task) {
    $('.tasks-list').append('<li class="tasks-item"><input type="checkbox" name="done"><span class="task-text" contenteditable>' + task + '</span><button name="delete-task">Delete</button></li>');
}

function updateMarkers() {
    if ($('input[name="done"]').length > 0) {
        var checked = $('input[name="done"]:checked').length;
        var left = $('input[name="done"]').length - checked;

        if (left > 0) {
            $('input[name="mark-all"]').prop('checked', false);
            $('#todos-left').text(left + ' left');
        } else {
            $('input[name="mark-all"]').prop('checked', true);
            $('#todos-left').text('');
        }
    } else {
        $('input[name="mark-all"]').prop('checked', false);
    }
}

function strike(elem) {
    if ($(elem).is(':checked')) {
        $(elem).siblings('.task-text').wrap('<strike>');
    } else {
        $(elem).siblings('strike').children().unwrap();
    }
}

function updateStorage() {
    var tasks = $('.task-text').toArray();
    for (i in tasks) {
        tasks[i] = tasks[i].innerHTML;
    }
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}
