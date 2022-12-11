import type { ElementHandle, NodeFor, Page } from "puppeteer";
import puppeteer from "puppeteer";

export const iNeedYou = <T>(something: T | null | undefined): T => {
  if (something == null) throw new Error("something you need is nullish");
  return something;
};

// slightly better version of puppeteer's nice NodeFor
export type DistributedNodeFor<T extends string> = T extends `${infer A}, ${infer B}` ? NodeFor<A> | NodeFor<B> : NodeFor<T>;

// Define the type of the element returned by page.$$
// TODO does extends contribute anything?
export type Elm<T extends Node = Node> = [T] extends [Node] ? ElementHandle<T> : never; // Element

// Define the type of the select function (querySelector)
export type SelectFn<In extends Node = Node, Out extends string = string> = (
  parent: Elm<In>,
  selector: Out
) => Promise<Elm<NodeFor<Out>>>;

// Define the type of the selectAll function (querySelectorAll)
export type SelectAllFn<In extends Node = Node, Out extends string = string> = (
  parent: Elm<In>,
  selector: Out
) => Promise<Elm<DistributedNodeFor<Out>>[]>;

//type Hej = SelectAllFn<HTMLBodyElement, HTMLDivElement>;

/**
 * The callback function that is passed to the boilerplate function
 * A domain crawler is a function with this type
 */
export type KravlBak<Out> = (args: {
  body: Elm<HTMLBodyElement>;
  page: Page;
  select: unknown;
  selectAll: unknown;
}) => Promise<Out>;

/**
 * See example usage in 1000fryd.server.ts
 * @param url
 * @param callback
 * @returns
 */
export const boilerplate = async <Out>(
  url: string,
  callback: KravlBak<Out>
) => {
  // Open a new browser and go to the page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // make some constants to give the KravlBak
  const body = iNeedYou(await page.$("body"));

  // document.node.querySelector
  const select = (async <Fra extends Node, Til extends string>(parent: Elm<Fra>, selector: Til) => {
    const element = await parent.$(selector); //.querySelector(selector);
    if (element == null) {
      throw new Error(["element not found", parent, selector].join(" "));
    }
    return element satisfies Elm<NodeFor<Til>>;
  }) satisfies SelectFn;

  // document.node.querySelectorAll
  const selectAll = (async <Fra extends Node, Til extends string>(parent: Elm<Fra>, selector: Til) => {
    const elements = await parent.$$(selector);
    if (elements.length == 0) {
      throw new Error(["no elements found", parent, selector].join(" "));
    }
    return elements satisfies Elm<NodeFor<Til>>[];
  }) satisfies SelectAllFn;

  //type Hej = ElementHandle<Element> extends Elm<Element> ? true : false;

  // Call the callback
  const result = await callback({ body, page, select, selectAll });
  await browser.close();
  // return from callback
  return result;
};

/**
 * ABOVE IS THE BOILERPLATE
 * THE REST IS JUST EXAMPLE
 */

/* const puppet = async (url: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);

  // Wait for the results page to load and display the results.
  const resultsSelector = "body a";
  await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  const links = await page.evaluate((resultsSelector) => {
    return [...document.querySelectorAll(resultsSelector)].map((anchor) => {
      const title = anchor.textContent;
      const href =
        anchor instanceof HTMLAnchorElement ? anchor.href : "NOT AN ANCHOR";
      return {
        title,
        href,
      };
    });
  }, resultsSelector);

  // Print all the files.
  //console.log(links.map((hej) => `${hej.title} - ${hej.href}`).join("\n"));

  await browser.close();

  return links;
}; */

/*export const select = async (page: Page, parent: Element, selector: string) => {
  return await page.evaluate(() => {
    // waitForSelector(selector)
    const element = parent.querySelector(selector);
    if (element == null)
      throw new Error(
        ["element not found", String(parent), selector].join(" ")
      );
    //if (!(element instanceof type)) throw new Error(['element is not an HTMLElement', String(parent), selector].join(' '))
    return element;
  });
}; */

/* export const selectAll = (parent: Element, selector: string) => {
  const elements = parent.querySelectorAll(selector);
  if (elements.length == 0)
    throw new Error(["no elements found", parent, selector].join(" "));
  return elements;
}; */

export default () => ["never", "gonna", "give", "you", "up"];
