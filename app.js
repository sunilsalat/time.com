// libraries native to node
import { createServer } from "http";
import http from "https";
// Replacement to the DomParser
import { JSDOM } from "jsdom";

const server = createServer((req, res) => {
  if (req.url === "/getTimeStories") {
    http
      .request({ host: "time.com", path: "/" }, (response) => {
        let str = "";

        response.on("data", (chunk) => {
          str += chunk;
        });

        response.on("end", () => {
          const dom = new JSDOM(str);

          const t = dom.window.document.querySelectorAll(
            "div.latest-stories>ul>li"
          );

          const news = [];

          // creating news list out of ChildNodes
          t.forEach((e) => {
            news.push({
              title: e.childNodes[1].children[0].innerHTML,
              link: `https://time.com/${e.childNodes[1].href}`,
            });
          });

          res.write(JSON.stringify(news));
          res.end();
        });
      })
      .end();
  } else {
    res.end(`
            <p>page your are looking for not found </P>
            <a href='/getTimeStories'>click here to fetch stories form time.com </a>
    `);
  }
});

server.listen(3000);
