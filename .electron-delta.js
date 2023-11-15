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
    console.log(context);
    const deltaInstallerFiles = await DeltaBuilder.build({
        context,
        options
    });
    return deltaInstallerFiles;
};