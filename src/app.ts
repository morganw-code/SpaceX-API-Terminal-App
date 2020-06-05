import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import {
  viewEngine,
  engineFactory,
  adapterFactory,
} from "https://deno.land/x/view_engine/mod.ts";

import { Endpoint } from "./constants/constants.ts";
import { IInfo } from "./interfaces/types.ts";
import StatsController from "./controllers/statsController.ts";

type Payload = IInfo | null;

class App {
  private payload: Payload = null;
  private infoPayload: Payload = null;
  private statsController: StatsController = new StatsController();
  private router: Router = new Router();
  private app: Application = new Application();
  private readonly port = 3000;

  private ejsEngine: any;
  private oakAdapter: any;

  constructor() {
    this.router.get("/stats", this.statsController.index);
    this.ejsEngine = engineFactory.getEjsEngine();
    this.oakAdapter = adapterFactory.getOakAdapter();
    this.app.use(viewEngine(this.oakAdapter, this.ejsEngine));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  async run() {
    await this.app.listen({ port: this.port });
  }

  async getRequest(endpoint: Endpoint, id = 0) {
    await fetch(endpoint)
      .then(async (response) => {
        return await response.json();
      })
      .then((payload) => {
        // set current payload
        this.payload = payload;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async setInfo() {
    await this.getRequest(Endpoint.INFO);
    if (this.payload !== null) {
      this.infoPayload = {
        name: this.payload?.name,
        founder: this.payload?.founder,
        founded: this.payload?.founded,
        employees: this.payload?.employees,
        vehicles: this.payload?.vehicles,
        launch_sites: this.payload?.launch_sites,
        test_sites: this.payload?.test_sites,
        ceo: this.payload?.ceo,
        cto: this.payload?.cto,
        coo: this.payload?.coo,
        cto_propulsion: this.payload?.cto_propulsion,
        valuation: this.payload?.valuation,
        headquarters: this.payload?.headquarters,
        summary: this.payload?.summary,
      };
    } else {
      console.log("was null");
    }
  }

  getInfo() {
    return this.infoPayload;
  }

  printData(obj: any = undefined) {
    if (obj !== undefined) {
      console.log(obj);
    } else {
      console.log(this.payload);
    }
  }
}

const app = new App();
await app.setInfo();
app.run();
app.printData(app.getInfo());
