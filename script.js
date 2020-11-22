$(".nonvisimg").addClass("blink_me");
setTimeout(() => { $(".visimg").addClass("blink_me") }, 250);

setTimeout(() => { $(".visimg").hide() }, 1000);
setTimeout(() => { $(".nonvisimg").hide() }, 1000);
setTimeout(() => {
    $(".box-row").css("min-height", "0px");
}, 1000);

setTimeout(() => {
    $("#loader").addClass("loader_zoom");
}, 2000);


setTimeout(() => { $("#loader").attr("style", "display: none !important"); }, 3000);
setTimeout(() => { $("#landing").attr("style", "opacity: 100%"); }, 3000);
