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

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, 
    function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

class StringBuilder
{
    constructor()
    {
        this.internalString = "";
    }
    
    Append(str)
    {
        this.internalString += str;
    }
    
    AppendLine(str)
    {
        this.internalString+=str+"\n";
    }
    
    NewLine()
    {
        this.internalString+="\n";
    }
    
    TabIndent()
    {
        this.internalString+="\t";
    }
    
    MultiTabIndent(numTabs)
    {
        var i;
        for(i=0; i<numTabs; i++)
        {
            this.TabIndent();
        }
    }
    
    Clear()
    {
        this.internalString = "";
    }
    
    get InternalString()
    {
        return this.internalString;
    }
}

class XmlStringBuilder extends StringBuilder
{
    constructor()
    {
        super();
        this.depth = 0;
        super.AppendLine("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
    }
    
    BeginNode(nodeName)
    {
        this.MaintainDepth();
        super.AppendLine("<"+nodeName+">")
    }
    
    AddCompleteChild(childName, childValue, isFirst)
    {
        if(isFirst)
        {
           this.depth++;
        }
        this.MaintainDepth();
        this.AddCompleteNode(childName,childValue);
    }
    
    AddChild(childName,isFirst)
    {
        if(isFirst)
        {
          this.depth++;
        }
        this.BeginNode(childName);
    }
    
    AddNodeValue(nodeValue)
    {
        super.Append(nodeValue);
    }
    
    EndNode(nodeName)
    {
        this.depth--;
        this.MaintainDepth();
        super.AppendLine("</"+nodeName+">");
    }
    
    AddCompleteNode(nodeName,nodeValue)
    {
        super.AppendLine("<"+nodeName+">"+nodeValue+"</"+nodeName+">");
    }
    
    BeginNodeWidthAttributes(nodeName)
    {
        super.Append("<"+nodeName);
    }
    
    AddNodeAttribute(attribueName,attributeValue)
    {
        super.Append(attribueName+"="+"\""+attributeValue+"\"");
    }
    
    FinishAttributes()
    {
        super.Append(">");
    }
    
    MaintainDepth()
    {
        super.MultiTabIndent(this.depth);
    }
    
    GetXml()
    {
        return super.InternalString;
    }
    
}