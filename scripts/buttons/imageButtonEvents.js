//This file is for button events related to the image selection sidebar.

function ImageButtonOnClick(imageIndex)
{
    CurrentImageBrush = new ImageBrush(ImageCache[imageIndex].src);
    console.log("Set image brush to: "+ImageCache[imageIndex].src);
}

//todo set selection color