'use strict';

var HEAD_REG = /<!--FEATHER STATIC POSITION:HEAD-->|(<\/head>)/i, BOTTOM_REG = /<!--FEATHER STATIC POSITION:BOTTOM-->|(<\/body>)/i;
var TPL_DIR = __dirname + '/vendor/';

module.exports = function(ret){
    var SUFFIX = feather.config.get('template.suffix');
    var HEAD_TPL = feather.util.read(TPL_DIR + 'head.php').replace('#suffix#', SUFFIX);
    var BOTTOM_TPL = feather.util.read(TPL_DIR + 'bottom.php').replace('#suffix#', SUFFIX);

    if(feather.config.get('project.modulename') == 'common'){
        var staticFile = feather.file.wrap(feather.project.getProjectPath() + '/_static_.' + SUFFIX);
        staticFile.setContent(feather.util.read(TPL_DIR + 'static.php'));
        ret.pkg[staticFile.subpath] = staticFile;
    }
    
    lothar.util.map(ret.ids, function(id, file){
        if(file.isHtmlLike){
            var content = file.getContent();

            if(file.isPagelet){
                content = HEAD_TPL + content;
            }else{
                content = content.replace(HEAD_REG, function(all, tag){
                    return HEAD_TPL + (tag || '');
                }).replace(BOTTOM_REG, function(all, tag){
                    return BOTTOM_TPL + (tag || '');
                });
            }

            file.setContent(content);
        }
    });
};