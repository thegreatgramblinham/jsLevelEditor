//This file is for button events related to the image selection sidebar.

function ImageButtonOnClick(imageIndex)
{
    CurrentImageBrush = new ImageBrush(ImageCache[imageIndex].src);
    console.log("Set image brush to: "+ImageCache[imageIndex].src);
}

//todo set selection color

addModeButton.onclick = function(e)
{
    CanvasMode = UIMode.Add;
    console.log("Switched to image ADD mode.");
    document.getElementById("addModeButton").style.backgroundColor = "red";
    document.getElementById("modfiyModeButton").style.backgroundColor = "darkgrey";
}

modfiyModeButton.onclick = function(e)
{
    CanvasMode = UIMode.Modify;
    console.log("Switched to image MODIFY mode.");
        document.getElementById("addModeButton").style.backgroundColor = "darkgrey";
    document.getElementById("modfiyModeButton").style.backgroundColor = "red";
}