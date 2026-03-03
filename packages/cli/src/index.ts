import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";

const program = new Command();

program
  .name("thuum")
  .description("Thu'um — Skyrim-themed React component library CLI")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize Thu'um in your project")
  .option("-c, --cwd <path>", "working directory", process.cwd())
  .action(initCommand);

program
  .command("add")
  .description("Add a component to your project")
  .argument("<component>", "component name to add")
  .option("-c, --cwd <path>", "working directory", process.cwd())
  .option("-y, --yes", "skip confirmation", false)
  .action(addCommand);

program
  .command("list")
  .description("List all available components")
  .action(listCommand);

program.parse();
