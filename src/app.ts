import { Endpoint } from "./constants/Constants.ts";
import { IInfo } from "./interfaces/Payloads.ts";

type Payload = IInfo;

class App {
  private payload: Payload | null = null;
  private infoPayload: Payload | null = null;
  constructor() {}

  async getRequest(endpoint: Endpoint, id = 0) {
    await fetch(endpoint)
      .then(async (response) => {
        return await response.json();
      }).then((payload) => {
        // set current payload
        this.payload = payload;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async setInfo() {
    await this.getRequest(Endpoint.INFO);
    if(this.payload !== null) {
      this.infoPayload = {
        name: this.payload.name,
        founder: this.payload.founder,
        founded: this.payload.founded,
        employees: this.payload.employees,
        vehicles: this.payload.vehicles,
        launch_sites: this.payload.launch_sites,
        test_sites: this.payload.test_sites,
        ceo: this.payload.ceo,
        cto: this.payload.cto,
        coo: this.payload.coo,
        cto_propulsion: this.payload.cto_propulsion,
        valuation: this.payload.valuation,
        headquarters: this.payload.headquarters,
        summary: this.payload.summary
      }
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
app.printData(app.getInfo());