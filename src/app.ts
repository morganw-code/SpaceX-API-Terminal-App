import { Endpoint } from "./constants/Constants.ts";
import { ILaunchPad } from "./interfaces/LaunchPad.ts";

class App {
  makeRequestAndHandle(endpoint: Endpoint, cb: Function) {
    fetch(endpoint)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        cb(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  printData(obj: any) {
    console.log(obj);
  }
}

const app = new App();
app.makeRequestAndHandle(Endpoint.LATEST_LAUNCHES, app.printData);
