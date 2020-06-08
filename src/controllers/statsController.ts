export default class StatsController {
  index(context: any, data: any) {
    context.render("views/stats/index.ejs", { data: { msg: data } });
    context.response.status = 200;
  }

  update() {}
}
