export async function linesFromInputFile(path: string): Promise<string[]> {
  return (await Deno.readTextFile(path)).split(/\r?\n/);
}
