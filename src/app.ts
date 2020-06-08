import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import {
  viewEngine,
  engineFactory,
  adapterFactory,
  Adapter,
  Engine,
} from "https://deno.land/x/view_engine/mod.ts";

import { Endpoint } from "./constants/constants.ts";
import { Payload, PayloadName } from "./constants/types.ts";
import { IPayloadCacheItem } from "./interfaces/types.ts";
import StatsController from "./controllers/statsController.ts";

class App {
  private statsController: StatsController = new StatsController();
  private router: Router = new Router();
  private app: Application = new Application();
  private readonly port = 3000;

  private ejsEngine: Engine;
  private oakAdapter: Adapter;

  private payloadCache: [IPayloadCacheItem?] = [];

  constructor() {
    // define routes
    this.router.get("/stats", (context) => {
      let data: string | number = "World";
      this.statsController.index(context, data);
    });

    // setup view engine to use ejs & oak, and register middleware
    this.ejsEngine = engineFactory.getEjsEngine();
    this.oakAdapter = adapterFactory.getOakAdapter();
    this.app.use(viewEngine(this.oakAdapter, this.ejsEngine));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async run() {
    // start the listener
    await this.app.listen({ port: this.port });
  }

  async getRequest(endpoint: Endpoint, payloadName: PayloadName) {
    await fetch(endpoint)
      .then(async (response) => {
        return await response.json();
      })
      .then((json) => {
        // set current payload
        this.payloadCache.push({
          name: payloadName,
          payload: json,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async setPayload(endpoint: Endpoint, payloadName: PayloadName) {
    await this.getRequest(endpoint, payloadName);
  }

  async getPayload(endpoint: Endpoint, payloadName: PayloadName, tries: number = 0) {
    for (const entry of this.payloadCache) {
      if (entry?.name === payloadName) {
        return entry;
      }
    }

    if (tries < 3) {
      await this.setPayload(endpoint, payloadName);
      this.getPayload(endpoint, payloadName, tries++);
    } else if (tries > 3) {
      console.log({
        message: `Failed to retrieve ${payloadName}`,
      });
    }
  }

  printData(obj: Object) {
    console.log(obj);
  }
}

const app = new App();
await app.setPayload(Endpoint.INFO, "info");
await app.setPayload(Endpoint.LATEST_LAUNCHES, "latest-launches");
app.run();
app.printData(app.getPayload(Endpoint.LATEST_LAUNCHES, "latest-launches"));
app.printData(app.getPayload(Endpoint.INFO, "info"));