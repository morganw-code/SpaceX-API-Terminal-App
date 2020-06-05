export default class StatsController {
  index(context: any) {
    context.render("views/stats/index.ejs", { data: { msg: "Hello" } });
    context.response.status = 200;
  }

  update() {}
}
