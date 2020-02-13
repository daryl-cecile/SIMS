

const lessc = require("less");
const fs = require("fs");
const path = require("path");

const FORCE_DELETE_BUILT_ITEM = false;

const DIRECTORIES_TO_IGNORE = [
    "node_modules",
    ".github",
    ".vscode",
    ".git",
    "public/storage"
];

function fixGitIgnore(filesToIgnore){
    let fileContent = fs.readFileSync( path.join(__dirname,".gitignore") , 'utf-8');

    filesToIgnore = ["### BEGIN clean", ...filesToIgnore, "### END"];

    let newFileContent = fileContent.replace(/((?:### BEGIN clean)[^]+(?:### END))/g, (filesToIgnore.map(k => {
        if (k.startsWith("#")) return k;
        return k.replace(`${__dirname}/`,"");
    })).join("\n"));

    fs.writeFileSync( path.join(__dirname,".gitignore"), newFileContent , 'utf-8');

    console.log("Updated gitignore");
}

function ignoreBuiltFiles(ref) {

    let toIgnore = [];

    function rm(thePath, ext) {
        let removedItems = [];

        ref[ext].forEach(k => {
            let p = path.join( path.dirname(thePath) , path.basename(thePath,`.${ext}`) + k);
            removedItems.push(p);
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
            if ( DIRECTORIES_TO_IGNORE.indexOf(path.basename(item)) > -1 ) return;

            let stat = fs.statSync(item);
            if (stat.isDirectory()) return walk(item);

            Object.keys(ref).forEach(k => {
                if ( item.endsWith(k) ) rm( item , k );
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


