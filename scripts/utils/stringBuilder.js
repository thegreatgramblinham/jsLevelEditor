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