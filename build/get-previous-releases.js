const axios = require("axios").default;
const {token} = require('../token.json');

const config = {
  headers: {
    "Authorization": `token ${token}`,
  }
};

const getPreviousReleases = async ({ platform, target }) => {
  let { data } = await axios.get(
    "https://api.github.com/repos/Cold-FR/city-hotel-app-remake/releases",
    config
  );

  const ext = platform === 'win' ? (target === 'nsis-web' ? ".7z" : ".exe") : ".zip";


  let prevReleases = data.reduce((arr, release) => {
    release.assets
      .map((d) => {
        return d.browser_download_url
      })
      .filter((d) => { return !d.includes('untagged') })
      .filter((d) => d.endsWith(ext))
      .forEach((url) => {
        // ignore web installers or delta files
        if (!url.endsWith("-delta.exe") && !url.includes("-Setup")) {
          arr.push({ version: release.tag_name, url });
        }
      });
    return arr;
  }, []);

  const oldreleases = prevReleases.slice(0, 3);

  return oldreleases;
};

module.exports = getPreviousReleases;