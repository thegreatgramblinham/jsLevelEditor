//This is the Utils file, mainly for small structures that we don't neet fully fleshed out
//classes for
function resizeThumb(left,top,heightAndWidth)
{
    this.left = left;
    this.top = top;
    this.width = heightAndWidth;
    this.height = heightAndWidth;
    this.right = this.left+this.width;
    this.bottom = this.top+this.height;
    this.centerX = this.left + (this.width/2);
    this.centerY = this.top + (this.height/2); 
}

function point(x,y)
{
    this.xCoordinate = x;
    this.yCoordinate = y;
}