//CheckBoxes Single Choice at a time
$('.radiocheck').on('change', function () {
    $('.radiocheck').not(this).prop('checked', false);
});

$('.ibu').on('change', function () {
    $('.ibu').not(this).prop('checked', false);
});

$('.alevel').on('change', function () {
    $('.alevel').not(this).prop('checked', false);
});

$('.mfeel').on('change', function () {
    $('.mfeel').not(this).prop('checked', false);
});

$('.color').on('change', function () {
    $('.color').not(this).prop('checked', false);
});

//Submit Button
$("#search").click(function () {

    var selected = new Array();
    var i = 0;
    $(':checkbox').each(function () {
        var checked_status = this.checked;
        if (checked_status == true) {
            selected[i] = $(this).attr("value");
            i++;
        }
    });
alert(selected)
window.location="processing.html";
});

