class LvlImporter
{
    constructor(inputPath)
    {
        this.inputFile = inputPath;
    }
    
    ImportLvlFile()
    {
        var xmlInputString = fs.readFileSync(this.inputFile, 'utf8');
        var parser = new DOMParser();
        var xml  = parser.parseFromString(xmlInputString,"text/xml");
       
    }
}