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