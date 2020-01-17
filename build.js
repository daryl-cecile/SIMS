

const lessc = require("less");
const fs = require("fs");
const path = require("path");

function clearBuiltFiles(){

    function rm(thePath) {
        let removedItems = [];
        let fileNameNoExt = path.basename(thePath,".js.map");
        let srcFile = path.join(path.dirname( thePath ) , fileNameNoExt + ".js");
        if ( fs.existsSync( srcFile) ) {
            fs.unlinkSync( srcFile );
            removedItems.push(srcFile);
        }
        fs.unlinkSync(thePath);
        removedItems.push(thePath);
        console.log("Removed", removedItems.join("and") );
    }

    function walk(thePath){
        console.log("Walking",thePath);
        let filesInRoot = fs.readdirSync(thePath);

        filesInRoot.forEach(item => {
            item = path.join(thePath, item);
            if ( path.basename(item) === "node_modules" ) return;
            if ( path.basename(item) === ".github" ) return;
            if ( path.basename(item) === ".vscode" ) return;

            let stat = fs.statSync(item);
            if (stat.isDirectory()) return walk(item);

            if ( item.endsWith(".js.map") ) rm( item );

        });
    }

    walk(__dirname);

}

function buildLess(){

    const STYLES_FOLDER = path.resolve("./public/styles");

    let entries = fs.readdirSync( STYLES_FOLDER );

    entries.forEach(entry => {

        let entryPath = path.join(STYLES_FOLDER,entry);
        let outputPath = path.join(STYLES_FOLDER, entry.replace(".less",".css") );
        let sourceMapPath = path.join(STYLES_FOLDER, entry.replace(".less", ".css.map"));

        if ( fs.statSync( entryPath ).isFile() ){

            if ( entry.startsWith("__") === false && entry.endsWith(".less") ){

                lessc.render( fs.readFileSync(entryPath, {encoding:"utf8"}) , {
                    env: "development",
                    sourceMap: { sourceMapFileInline: false },
                    paths: [STYLES_FOLDER]
                }).then(function(out){
                    fs.writeFileSync(outputPath,out.css,{encoding:"utf8"});
                    fs.writeFileSync(sourceMapPath,out.map,{encoding:"utf8"});
                }).catch(function(err){
                    console.error(err);
                });

            }

        }

    });

}

clearBuiltFiles();

buildLess();