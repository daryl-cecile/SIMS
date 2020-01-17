

const lessc = require("less");
const fs = require("fs");
const path = require("path");

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