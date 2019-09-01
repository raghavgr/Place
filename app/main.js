(function () {
    var socket = io();

    var colors = document.getElementsByClassName('options');
    var canvas = document.getElementsByClassName('place')[0];
    var cnvsCtxt = canvas.getContext('2d');
    var selection = {
        color: 'black'
    };
    var currentlyDrawing = false;
    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);


    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener("click", onColorSelected, false);
    }

    // This has the socket checking if anyone is drawing as well
    socket.on('startDrawing', drawingLine);

    // listens if the squares are being drawn or not.
    socket.on('drawSquare', drawingSquare);

    /**
     * Draws Line
     * @param x
     * @param y
     * @param endX
     * @param endY
     * @param color
     * @param emit
     */
    function draw(x, y, endX, endY, color, emit) {
        cnvsCtxt.beginPath();
        cnvsCtxt.strokeStyle = color;
        cnvsCtxt.moveTo(x, y);
        cnvsCtxt.lineTo(endX, endY);
        cnvsCtxt.lineWidth = 3;
        cnvsCtxt.stroke();
        cnvsCtxt.closePath();

        if (!emit) {return;}
        var w = canvas.width;
        var h = canvas.height;
        socket.emit('startDrawing', {
            x: x / w,
            y: y / h,
            endX: endX / w,
            endY: endY / h,
            color: color
        });

    }

    /**
     * Draw a square and emit it
     * @param x
     * @param y
     * @param endX
     * @param endY
     * @param color
     * @param emit
     */
    function drawSquare(x, y, endX, endY, color, emit) {
        cnvsCtxt.beginPath();
        var w = x-endX;
        var h = y-endY;
        cnvsCtxt.fillStyle = color;
        cnvsCtxt.fillRect(endX, endY, w, h);
        cnvsCtxt.stroke();

        if(!emit) {return;}
        var cnvsWidth = canvas.width;
        var cnvsHeight = canvas.height;
        socket.emit('drawSquare', {
            x: x / cnvsWidth,
            y: y / cnvsHeight,
            endX: endX / cnvsWidth,
            endY: endY / cnvsHeight,
            color: color
        });
    }

    function onMouseDown(event) {
        currentlyDrawing = true;
        selection.x = event.clientX;
        selection.y = event.clientY;
    }


    // to draw a line, change the drawSquare to draw in this method
    function onMouseUp(event) {
        if (!currentlyDrawing) {
            return;
        }
        currentlyDrawing = false;

        drawSquare(selection.x, selection.y, event.clientX, event.clientY, selection.color, true);
    }



    function drawingLine(data) {
        var w = canvas.width;
        var h = canvas.height;
        draw(data.x * w, data.y * h, data.endX * w, data.endY * h, data.color);
    }

    function drawingSquare(data) {
        var w = canvas.width;
        var h = canvas.height;
        drawSquare(data.x * w, data.y * h, data.endX * w, data.endY * h, data.color);
    }

    function onColorSelected(event) {
        //console.log(event.target.className.split(' ')[1]);
        selection.color = event.target.className.split(' ')[1];
        console.log(selection.color);
    }

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // The following code did not work
    // Clear function works with only one user. Not sure why otherwise

    socket.on('clear', clearCanvas);

    $("#clearCanvas").on('click', function () {
        clearCanvas();
        console.log('clearing canvas button cliecked');
    });

    function clearCanvas() {
        console.log('clear canvas');
        cnvsCtxt.setTransform(1, 0, 0, 1, 0, 0);
        cnvsCtxt.clearRect(0, 0, canvas.width, canvas.height);
    }

})();



