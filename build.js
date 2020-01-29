

const lessc = require("less");
const fs = require("fs");
const path = require("path");

const FORCE_DELETE_BUILT_ITEM = false;

function fixGitIgnore(filesToIgnore){
    let fileContent = fs.readFileSync( path.join(__dirname,".gitignore") , 'utf-8');
    let lines = fileContent.split("\n");
    let overwrite = false;

    let newFileLines = [];

    lines.forEach(line => {
        if (line.trim() === "### BEGIN clean"){
            newFileLines.push(line);
            overwrite = true;
            return;
        }
        else if (line.trim() === "### END"){
            newFileLines.push(line);
            overwrite = false;
            return;
        }
        else if (overwrite === true){
            newFileLines.push( ...(filesToIgnore.map(k => k.replace(`${__dirname}/`,""))) );
            overwrite = false;
        }
        else{
            newFileLines.push(line);
        }
    });

    fs.writeFileSync( path.join(__dirname,".gitignore"), newFileLines.join("\n") , 'utf-8');

    console.log("Updated gitignore");
}

function ignoreBuiltFiles(ref) {

    let toIgnore = [];

    function rm(thePath) {
        let removedItems = [];

        Object.keys(ref).map(coreExt => {
            ref[coreExt].forEach(k => {
                let p = path.join( path.dirname(thePath) , path.basename(thePath,`.${coreExt}`) + k);
                removedItems.push(p);
            });
        });

        if (FORCE_DELETE_BUILT_ITEM){
            removedItems.forEach(item => {
                if (fs.existsSync(item)){
                    fs.unlinkSync(item);
                }
            })
        }

        if (removedItems.length > 0){
            toIgnore = [...toIgnore, ...removedItems];
        }
    }

    function walk(thePath){
        let filesInRoot = fs.readdirSync(thePath);

        filesInRoot.forEach(item => {
            item = path.join(thePath, item);
            if ( path.basename(item) === "node_modules" ) return;
            if ( path.basename(item) === ".github" ) return;
            if ( path.basename(item) === ".vscode" ) return;
            if ( path.basename(item) === ".git" ) return;

            let stat = fs.statSync(item);
            if (stat.isDirectory()) return walk(item);

            Object.keys(ref).forEach(k => {
                if ( item.endsWith(k) ) rm( item );
            });

        });
    }

    walk(__dirname);

    fixGitIgnore(toIgnore)
}

function buildLess(cb){

    function decrementTaskCount(){
        tasksRemaining --;
        if (tasksRemaining === 0 && cb) cb();
    }

    const STYLES_FOLDER = path.resolve("./public/styles");

    let tasksRemaining = 0;
    let entries = fs.readdirSync( STYLES_FOLDER );

    entries.forEach(entry => {

        let entryPath = path.join(STYLES_FOLDER,entry);
        let outputPath = path.join(STYLES_FOLDER, entry.replace(".less",".css") );
        let sourceMapPath = path.join(STYLES_FOLDER, entry.replace(".less", ".css.map"));

        if ( fs.statSync( entryPath ).isFile() ){

            if ( entry.startsWith("__") === false && entry.endsWith(".less") ){

                tasksRemaining ++;

                lessc.render( fs.readFileSync(entryPath, {encoding:"utf8"}) , {
                    env: "development",
                    sourceMap: { sourceMapFileInline: false },
                    paths: [STYLES_FOLDER]
                }).then(function(out){
                    fs.writeFileSync(outputPath,out.css,{encoding:"utf8"});
                    fs.writeFileSync(sourceMapPath,out.map,{encoding:"utf8"});
                    decrementTaskCount();
                }).catch(function(err){
                    console.error(err);
                    decrementTaskCount();
                });

            }

        }

    });

}

buildLess(()=>{

    ignoreBuiltFiles({
        ts:[".js.map",".d.ts", ".js"],
        less:[".css",".css.map"]
    });

});


