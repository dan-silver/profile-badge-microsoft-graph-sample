var badgeMarginBelowPercent = 0.01
var badgeMaxWidthPercent = 0.35;



function uploadPicture() {

    stage.toDataURL({
        callback: function(dataUrl) {
            $.ajax({
                type: "GET",
                url: "/user/sendEmailWithBackupPhoto"
            }).done(function() {
                $.ajax({
                    type: "POST",
                    url: "/user/profileWithBadge",
                    data: {base64: dataUrl}
                }).done(function() {
                    window.location.href="/user/updateComplete";
                })
                window.location.href="/user/updateComplete";
            })

            
            var uploadBtn = document.getElementById("uploadPicture");
            uploadBtn.setAttribute("disabled", "disabled");
            uploadBtn.innerText = "Uploading picture...";
            setTimeout(function() {
                uploadBtn.innerText = "Still uploading your picture...";

            }, 2500);
        }
    });
}



var stage;
function drawBaseImage(currentPhoto) {
    stage = new Konva.Stage({
        container: 'badgeDesigner',
        width: currentPhoto.naturalWidth,
        height: currentPhoto.naturalHeight
    });

    var layer = new Konva.Layer();

    layer.add(new Konva.Image({
        image: currentPhoto,
        x: 0,
        y: 0,
        width: currentPhoto.naturalWidth,
        height: currentPhoto.naturalHeight,
        draggable: false
    }));

    stage.add(layer);
    
    addVotingBadge();
}

var votingBadgeLayer;

function drawImage(imageObj) {
    votingBadgeLayer = new Konva.Layer();
    var votingBadge = new Konva.Image({
        image: imageObj,
        x: stage.getWidth() / 2 - imageObj.width / 2,
        y: stage.getHeight() / 2 - imageObj.height / 2,
        width: imageObj.width / 4,
        height: imageObj.height / 4,
        draggable: true
    });

    // add cursor styling
    votingBadge.on('mouseover', function() {
        document.body.style.cursor = 'pointer';
    });
    votingBadge.on('mouseout', function() {
        document.body.style.cursor = 'default';
    });

    votingBadgeLayer.add(votingBadge);
    stage.add(votingBadgeLayer);

    addTouchEvents();

}

var lastDist = 0;
var startScale = 1;

var currentUserPhotoObj = new Image();
currentUserPhotoObj.onload = function() {
    drawBaseImage(this);
};
currentUserPhotoObj.src = '/user/photo';

function addVotingBadge() {
    var img = new Image();
    img.onload = function() {
        drawImage(this);
    };
    img.src = "/img/vote.png";
}

function addTouchEvents() {
    
    $('.konvajs-content canvas')[1].addEventListener('mousewheel',function(event){
        var dirrection = event.wheelDelta > 0 ? 1 : -1;
        var currentScale = votingBadgeLayer.getScaleX();

        var scale = currentScale * (100 + dirrection)*0.01;
        votingBadgeLayer.scaleX(scale);
        votingBadgeLayer.scaleY(scale);
        votingBadgeLayer.draw();    
        event.preventDefault();
        return false; 
    }, false);



    stage.getContent().addEventListener('touchmove', function(evt) {
        var touch1 = evt.touches[0];
        var touch2 = evt.touches[1];

        if(touch1 && touch2) {
            var dist = getDistance({
                x: touch1.clientX,
                y: touch1.clientY
            }, {
                x: touch2.clientX,
                y: touch2.clientY
            });

            if(!lastDist) {
                lastDist = dist;
            }

            var scale = votingBadgeLayer.getScaleX() * dist / lastDist;

            votingBadgeLayer.scaleX(scale);
            votingBadgeLayer.scaleY(scale);
            votingBadgeLayer.draw();
            lastDist = dist;
        }
    }, false);

    stage.getContent().addEventListener('touchend', function() {
        lastDist = 0;
    }, false);
}




function getDistance(p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}