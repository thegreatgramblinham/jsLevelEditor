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
        super.AppendLine("<"+ this.CleanNodeName(nodeName) +">")
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
    
    AddBlankChild(childName, isFirst)
    {
        if(isFirst)
           this.depth++;
        
        this.BeginNode(childName);
        
        this.depth++;
           
        this.EndNode(childName);      
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
        super.AppendLine("</"+ this.CleanNodeName(nodeName) +">");
    }
    
    AddCompleteNode(nodeName,nodeValue)
    {
        var name = this.CleanNodeName(nodeName);
        super.AppendLine("<"+name+">"+nodeValue+"</"+name+">");
    }
    
    BeginNodeWidthAttributes(nodeName)
    {
        var name = this.CleanNodeName(nodeName);
        super.Append("<"+name);
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
    
    CleanNodeName(nodeName)
    {
        var charArr = nodeName.split('');
        var newNodeName = "";
        for(var i = 0; i < charArr.length; i++)
        {
            var char = charArr[i];
            
            //chars to skip here
            if(char == " ") continue;
            
            newNodeName += char;
        }
        
        //Remove non-breaking space placeholders too.
        newNodeName = newNodeName.split("&nbsp;").join("");
        
        return newNodeName;
    }
    
    GetXml()
    {
        return super.InternalString;
    }
    
}