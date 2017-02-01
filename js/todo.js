$(function () {
    var tasks = JSON.parse(localStorage.getItem('todoTasks'));
    if (tasks == null)
        localStorage.setItem('todoTasks', '[]');
    else
        for (var i in tasks)
            addToList(tasks[i]);

    updateMarkers();

    $('#new-task-form').submit(function () {
        var task = $('#new-task-input');

        if ($('.task-item').length == 0)
            $('.complete-marker').css('display', 'block');

        addToList(task.val());
        task.val('');

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

$(document).delegate('span.delete-task', 'click', function () {
    $(this).parent().remove();
    updateMarkers();
    updateStorage();
});

$(document).delegate('input[name="done"]', 'change', function () {
    strike(this);
    updateMarkers();
});

$(document).delegate('.task-item', 'mouseenter', function () {
    $(this).children('span.delete-task').css('visibility', 'visible');
});

$(document).delegate('.task-item', 'mouseleave', function () {
    $(this).children('span.delete-task').css('visibility', 'hidden');
});


function addToList(task) {
    $('.tasks-list').append(
        '<li class="list-group-item task-item">' +
        '   <input type="checkbox" name="done">' +
        '   <span class="task-text" contenteditable>' + task + '</span>' +
        '   <span class="delete-task glyphicon glyphicon-remove-sign" aria-hidden="true"></span>' +
        '</li>');
}

function updateMarkers() {
    if ($('input[name="done"]').length > 0) {
        var checked = $('input[name="done"]:checked').length;
        var left = $('input[name="done"]').length - checked;

        if (checked > 0)
            $('#delete-all').css('display', 'inline');
        else
            $('#delete-all').css('display', 'none');

        if (left > 0)
            $('input[name="mark-all"]').prop('checked', false);
        else
            $('input[name="mark-all"]').prop('checked', true);

        $('#todos-left').text(left + ' task(s) left');
    } else {
        $('input[name="mark-all"]').prop('checked', false).parent().css('display', 'none');
        $('#todos-left').text('');
        $('#delete-all').css('display', 'none');
    }
}

function strike(elem) {
    if ($(elem).is(':checked'))
        $(elem).siblings('.task-text').css('color', '#777').wrap('<strike>');
    else
        $(elem).siblings('strike').children().css('color', '#000').unwrap();
}

function updateStorage() {
    var tasks = $('.task-text').toArray();
    for (var i in tasks)
        tasks[i] = tasks[i].innerHTML;

    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}
