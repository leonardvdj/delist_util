import fetch from "node-fetch";
import hjson from "hjson";
import fs from "fs";

const instances = JSON.parse(fs.readFileSync("./instances.json", "utf-8"));
let polling_interval = 15; // seconds

async function GetDelistTokens() {
   let tokens = [];
   try {
      let req = await fetch("https://www.binance.com/bapi/composite/v1/public/cms/article/list/query?type=1&pageNo=1&pageSize=30");
      let news = await req.json();
      let catalogs = news.data.catalogs;
      for (let i = 0; i < catalogs.length; i++) {
         let catalog = catalogs[i];
         for (let j = 0; j < catalog.articles.length; j++) {
            let article = catalog.articles[j];
            if (article.title.toLowerCase().includes("binance will delist")) {
               // console.log(`${catalog.catalogName}: ${article.title}`);
               let article_tokens = article.title.toUpperCase().split("BINANCE WILL DELIST")[1].split(" ON ")[0].split("&").map(elem => elem.trim());
               tokens.push(...article_tokens);
            }
         }
      }
   }catch(e) {}
   return tokens;
}

async function GetBlacklist(port, user, pass) {
   let blacklist = [];
   try {
      let req = await fetch(`http://127.0.0.1:${port}/api/v1/blacklist`, {
         headers: {
            "Authorization": `Basic ${Buffer.from(user + ":" + pass).toString("base64")}`
         }
      });
      blacklist = (await req.json()).blacklist;
   }catch(e) {}
   return blacklist;
}

async function BlacklistPair(port, user, pass, config_location, pair) {
   console.log(`Blacklisting ${pair} for instance on port ${port}`);
   fetch(`http://127.0.0.1:${port}/api/v1/blacklist`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
         "Authorization": `Basic ${Buffer.from(user + ":" + pass).toString("base64")}`
      },
      body: JSON.stringify({blacklist: [pair]})
   });

   let config = hjson.parse(fs.readFileSync(config_location, "utf-8"), {keepWsc: true});
   if (!config.exchange.pair_blacklist.includes(pair)) {
      config.exchange.pair_blacklist.push(pair);
      fs.writeFileSync(config_location, hjson.stringify(config, {keepWsc: true, bracesSameLine: true, quotes: "all", space: 4, separator: true}));
   }
}

async function Loop() {
   console.log("Checking for delisted tokens...");
   let blacklisted_tokens = [];
   let tokens = await GetDelistTokens();
   for (let i = 0; i < instances.length; i++) {
      let blacklist = await GetBlacklist(instances[i].port, instances[i].user, instances[i].pass);
      let tokens_not_blacklisted = tokens.filter(token => !blacklist.map(bl_pair => bl_pair.split("/")[0].toUpperCase()).includes(token));
      for (let j = 0; j < tokens_not_blacklisted.length; j++) {
         await BlacklistPair(instances[i].port, instances[i].user, instances[i].pass, instances[i].config, `${tokens_not_blacklisted[j]}/.*`);
         blacklisted_tokens.push(tokens_not_blacklisted[j]);
      }
   }
   blacklisted_tokens = [...new Set(blacklisted_tokens)];
   if (blacklisted_tokens.length !== 0) {
      console.log(`Blacklisted ${blacklisted_tokens.length} tokens.`);
   }
}

Loop();
setInterval(Loop, polling_interval * 1000);