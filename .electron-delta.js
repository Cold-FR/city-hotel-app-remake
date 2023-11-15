const DeltaBuilder = require("@electron-delta/builder");
const {productName} = require('./package.json');

const path = require("path");
const getPreviousReleases = require("./build/get-previous-releases");

const options = {
    productIconPath: path.join(__dirname, "icon.ico"),
    productName: productName,
    getPreviousReleases: ({ platform, target }) => {
        console.log("getPreviousReleases", platform, target);
        return getPreviousReleases({ platform, target });
    },
    sign: async (filePath) => {
        // sign each delta executable
        return filePath;
    },
};

exports.default = async function (context) {
    console.log('\n\n\n');
    console.log(Array.from(context.platformToTargets)[0][0].name);
    console.log('\n\n\n');
    if(Array.from(context.platformToTargets)[0].name === 'mac') return;
    
    const deltaInstallerFiles = await DeltaBuilder.build({
        context,
        options
    });
    return deltaInstallerFiles;
};