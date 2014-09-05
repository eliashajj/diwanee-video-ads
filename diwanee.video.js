/**
 * Created by elias el hajj on 9/3/14.
 */
function callDiwaneeVideo(videoID,adLink,linkTarget){

    $(document).ready(function(){

        kWidget.embed({
            'targetId': 'myEmbedTarget',
            'wid': '_676152',
            'uiconf_id' : '25068661',
            'entry_id' : videoID,
            'flashvars':{
                'autoPlay': false,
                'externalInterfaceDisabled' : false,
                'disableOnScreenClick': true,
                'KalturaSupport.LeadWithHTML5' : true,
                'largePlayBtn.plugin': false,

            },
            'params':{
                'wmode': 'transparent'
            },
            'plugins':{
                'largePlayBtn': {}
            },
            'readyCallback': function( playerId ){

                var kdp = $( '#' + playerId ).get(0);

                kdp.kBind( 'playerPlayEnd', function(){
                    console.log(  "playerPlayEnd called on  " + playerId );
                    kWidget.destroy( 'myEmbedTarget' );
                    $("#diwaneeVideoAdContainer").slideUp();
                    $("#myEmbedTarget").slideUp();
                    $("#ytplayerLink").slideUp();
                    $("#skipAd").slideUp();
                    $("#advertisement").slideUp();
                    $(window).unbind("scroll");
                });

                $("#myEmbedTarget, #skipAd, #ytplayerLink").mouseover(function(){
                    kdp.sendNotification('changeVolume','0.75');
                    return false;
                });

                $("#myEmbedTarget, #skipAd, #ytplayerLink").mouseout(function(){
                    kdp.sendNotification('changeVolume','0');
                    return false;
                });

                $("#ytplayerLink").click(function(){
                    window.open(adLink, linkTarget);
                });

                $("#skipAd").click(function(){
                    kWidget.destroy( 'myEmbedTarget' );
                    $("#diwaneeVideoAdContainer").slideUp();
                    $("#myEmbedTarget").slideUp();
                    $("#ytplayerLink").slideUp();
                    $("#skipAd").slideUp();
                    $("#advertisement").slideUp();
                    $(window).unbind("scroll");
                });

                kdp.kBind( 'playerUpdatePlayhead', function(data, id){
                    console.log(  "playerUpdatePlayhead  " + data );
                    if(data>5){
                        $('#skipAd').css('display','block');
                    }
                });

                $.fn.isOnScreen = function(){
                    var win = $(window);
                    var viewport = {
                        top : win.scrollTop(),
                        left : win.scrollLeft()
                    };

                    viewport.top = viewport.top - 250;
                    viewport.right = viewport.left + win.width();
                    viewport.bottom = viewport.top + win.height();

                    var bounds = this.offset();
                    bounds.right = bounds.left + this.outerWidth();
                    bounds.bottom = bounds.top + this.outerHeight();

                    return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
                };

                var i=0;

    //            $(window).scroll(function(){
    //                if($('#advertisement').isOnScreen() && i<1){
    //                    $("#diwaneeVideoAdContainer").slideDown();
    //                    $("#myEmbedTarget").slideDown();
    //                    $("#ytplayerLink").slideDown();
    //                    kdp.sendNotification("doPlay");
    //
    //                    var videoWidth = $("#adWrapper").width();
    //                    var videoHeight = (326*videoWidth)/580;
    //
    //                    $("#myEmbedTarget").width(videoWidth).height(videoHeight);
    //                    i = i+1;
    //                }
    //            });

                var checkVideoPosition = window.setInterval(function(){
                    if($('#advertisement').isOnScreen()){
                        $("#diwaneeVideoAdContainer").slideDown();
                        $("#myEmbedTarget").slideDown();
                        $("#ytplayerLink").slideDown();
                        kdp.sendNotification("doPlay");

                        var videoWidth = $("#adWrapper").width();
                        var videoHeight = (326*videoWidth)/580;

                        $("#myEmbedTarget").width(videoWidth).height(videoHeight);

                        clearInterval(checkVideoPosition);
                        i = i+1;
                    }
                }, 100);

                $('#myEmbedTarget').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
                    var kdp = document.getElementById('myEmbedTarget');
                    if (isInView) {
                        if (visiblePartY == 'top') {
                            kdp.sendNotification("doPause");
                        } else if (visiblePartY == 'bottom') {
                            kdp.sendNotification("doPause");
                        }
                        if(visiblePartY == 'both') {
                            if($('#myEmbedTarget').offset().top>500){
                                kdp.sendNotification("doPlay");
                            }
                        }
                    } else {
                        kdp.sendNotification("doPause");
                    }
                });
            }
        });
    });
}