import esbuild from "esbuild";
import process from "process";

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  entryPoints: ["main.ts"],
  bundle: true,
  external: ["obsidian", "electron", "codemirror", "@codemirror/*"],
  format: "cjs",
  target: "es2018",
  logLevel: "info",
  sourcemap: "inline",
  outfile: "main.js",
});

if (watch) {
  await ctx.watch();
  console.log("watching...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
