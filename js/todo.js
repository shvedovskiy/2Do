$(function () {
    var tasks = JSON.parse(localStorage.getItem('todoTasks'));
    if (tasks == null)
        localStorage.setItem('todoTasks', '[]');
    else
    if (tasks.length > 0)
        updateVisibility(true);
    for (var i in tasks)
        addToList(tasks[i]);

    updateMarkers();

    $('#new-task-form').submit(function (e) {
        if ($(this).find("[required]").val() == '') {
            e.preventDefault();
            alert("Required field should not be blank.");
            return false;
        }

        var task = $('#new-task-input');
        if ($('.task-item').length == 0)
            updateVisibility(true);

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

$(document).delegate('span.task-text', 'click', function () {
    $(this).blur(function () {
        if ($(this).val().length == 0)
            $(this).parent().remove();
        updateStorage();
    });
});

$(document).delegate('span.task-text', 'dblclick', function () {
    var input = $('<input type="text">').attr('value', $(this).text());
    $(this).replaceWith(input);

    input.focus();
    input.blur(function () {
        if ($(this).val().length == 0)
            $(this).parent().remove();
        else
            $(this).replaceWith($('<span class="task-text">').text($(this).val()));

        updateStorage();
        updateMarkers();
    });
    input.keypress(function (e) {
        if (e.which == 13) {
            if ($(this).val().length == 0)
                $(this).parent().remove();
            else
                $(this).replaceWith($('<span class="task-text">').text($(this).val()));

            updateStorage();
            updateMarkers();
        }
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

function updateVisibility(isVisible) {
    if (isVisible) {
        $('.complete-marker').css('display', 'block');
        $('.todo-content').css('display', 'block');
        $('.todo-footer').css('display', 'block');
    } else {
        $('.complete-marker').css('display', 'none');
        $('.todo-content').css('display', 'none');
        $('.todo-footer').css('display', 'none');
    }
}

function addToList(task) {
    $('.tasks-list').append(
        '<li class="list-group-item task-item">' +
        '   <input type="checkbox" name="done">' +
        '   <span class="task-text">' + task + '</span>' +
        '   <span class="delete-task glyphicon glyphicon-remove-sign" aria-label="Delete task"></span>' +
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
        $('input[name="mark-all"]').prop('checked', false);
        $('#todos-left').text('');
        updateVisibility(false);
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
