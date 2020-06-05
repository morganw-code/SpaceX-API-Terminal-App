export default class StatsController {
  show(context: any) {
    // send the response
    context.response.body = "Works!";
    context.response.status = 200;
  }

  update() {}
}
