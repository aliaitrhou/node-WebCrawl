function getNormalURL(urlStr) {
  const url = new URL(urlStr);
  const host = `${url.hostname}${url.pathname}`;
  if (host.length > 0 && host.slice(-1) === "/") {
    return host.slice(0, -1);
  }
  return host;
}

module.exports = {
  getNormalURL,
};
