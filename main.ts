import * as path from "jsr:@std/path";

const paths = {
  rootDir: path.resolve(import.meta.dirname ?? "."),
  solutionsDir: path.join(
    path.resolve(import.meta.dirname ?? "."),
    "./solutions",
  ),
  dayFolder: (day: number) => path.join(paths.solutionsDir, day.toFixed(0)),
  solutionModulePath: (day: number, part: number) =>
    path.join(paths.dayFolder(day), `p${part.toFixed(0)}.ts`),
};

if (import.meta.main) {
  await Deno.permissions.request({
    name: "read",
    path: "solutions",
  });

  const args = [...Deno.args];
  const day = Number(args.shift());
  let part: undefined | number = undefined;

  if (Number.isNaN(day)) {
    throw new Error("Day must be specified as a number");
  }

  if (args[0] && args[0].trim() !== "--") {
    const parsedPart = Number(args[0]);
    if (!Number.isNaN(parsedPart)) {
      part = parsedPart;
      args.shift();
    }
  }

  if (args[0]?.trim() === "--") {
    args.shift();
  }

  const targets = part === undefined
    ? [1, 2].map((part) => [day, part])
    : [[day, part]];

  for (const [day, part] of targets) {
    const loadPath = paths.solutionModulePath(day, part);
    const workingDir = paths.dayFolder(day);

    Deno.chdir(workingDir);
    console.debug(
      `\n%c${path.relative(paths.rootDir, loadPath)}`,
      "font-weight: bold; text-decoration: underline;",
    );

    let main: (...args: unknown[]) => void | Promise<void>;
    try {
      main = (await import(loadPath)).default;
    } catch (err) {
      console.warn(`%cFailed to load module:%c\n${err}`, "color: orange", "");
      continue;
    }

    await main(args);
  }
}
