"use strict";
//Methods
openFolderButton.onclick = function(event) 
{
    dialog.showOpenDialog(
        function (fileNames) 
        {
            if (fileNames === undefined) return;
            var fileName = fileNames[0];
            
            //Call load images function here.
        }
    );
}

saveLevelButton.onclick = function(event) 
{
    dialog.showSaveDialog(
        { filters: [{ name: 'JsLeveLEditor Files (*.msg)', extensions: ['msg'] }] },
        function (fileName) 
        {
            if (fileName === undefined) return;
            
            //Call xml writing function here.
        }
    );
}

openLevelButton.onclick = function(event) 
{
        dialog.showOpenDialog(
            { filters: [{ name: 'JsLeveLEditor Files (*.msg)', extensions: ['msg'] }] },
            function (fileNames) 
            {
                if (fileNames === undefined) return;
                var fileName = fileNames[0];
                
                //Call level reconst function here.
            }
    );
}
