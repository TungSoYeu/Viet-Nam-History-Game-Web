const dns = require('dns');

console.log("Servers:", dns.getServers());

dns.resolveSrv('_mongodb._tcp.projecnckh.qlbvlo3.mongodb.net', (err, addresses) => {
  if (err) {
    console.error("resolveSrv error:", err);
  } else {
    console.log("Addresses:", addresses);
  }
});
