import pc from "picocolors";

const PREFIX = pc.bold(pc.yellow("⚔ Thu'um"));

export const logger = {
  info(msg: string) {
    console.log(`${PREFIX} ${msg}`);
  },
  success(msg: string) {
    console.log(`${PREFIX} ${pc.green(msg)}`);
  },
  warn(msg: string) {
    console.log(`${PREFIX} ${pc.yellow(msg)}`);
  },
  error(msg: string) {
    console.error(`${PREFIX} ${pc.red(msg)}`);
  },
  shout(component: string) {
    console.log(`${PREFIX} ${pc.cyan(`Shouting ${pc.bold(component)} into your project...`)}`);
  },
  power() {
    console.log(`${PREFIX} ${pc.green("Thu'um grows stronger.")}`);
  },
};
