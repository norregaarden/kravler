//import puppeteer from "puppeteer";
import { NodeFor } from "puppeteer";
import type {
  DistributedNodeFor,
  Elm,
  KravlBak,
} from "~/krybogkravl/puppet.server";
import { boilerplate, iNeedYou } from "~/krybogkravl/puppet.server";
import type { FrydfulMaaned } from "../types";

const t000fryd = (async ({
  body,
  page,
  select,
  selectAll,
}) => {
  const parentSelector = ".container div";

  //const

  // a row is either a month or an event
  /*   const rows = await page.evaluate((parentSelector) => {
    const parent = select(document.documentElement, parentSelector);
    return selectAll(parent, ".row");
  }, parentSelector); */

  const parent = await selectAll(body, parentSelector);

  const rows = await selectAll(parent[0], "div.row, a.row");

  //type Fej = Elm<HTMLAnchorElement | HTMLDivElement>[]
  //type Kaj = NodeFor<'div.row'> | NodeFor<'a.row'>
  //type Nej = DistributedNodeFor<'div.row, a.row'>

  // liste af måneder som hver er en
  // liste af koncerter som hver er en
  // liste af bands
  const fryd: FrydfulMaaned[] = []

    for (const row of rows) {
      if (
        row instanceof HTMLDivElement &&
        row.classList.contains("calendar_month")
      ) {
        // MONTH
        const month = await select(row, ".col.text-center");
        if (month == null) throw new Error("month is null");
        fryd.push({
          month: month,
          events: [],
        });
      } else if (
        row instanceof HTMLAnchorElement &&
        row.classList.contains("calendar_entry")
      ) {
        // EVENT
        const href = row.href;

        const left = select(row, ".col-2.text-center");
        const day = iNeedYou(Number(select(left, ".calendar_day").textContent));
        const price = iNeedYou(
          Number(select(left, ".calendar_price").textContent?.split(" ")[0])
        );

        const right = select(row, ".col div");
        const bands = right.innerHTML.trim().split("<br>");

        fryd[fryd.length - 1].events.push({
          bands,
          href,
          day,
          price,
        });
      }
    }

  return fryd;
}) satisfies KravlBak<FrydfulMaaned[]>;

export default () => boilerplate("http://1000fryd.dk/", t000fryd);
