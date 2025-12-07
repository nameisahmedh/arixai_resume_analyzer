const { execSync } = require("child_process");
const { rmSync, mkdirSync } = require("fs");

try {
  console.log("Cleaning dist...");
  rmSync("dist", { recursive: true, force: true });
  mkdirSync("dist", { recursive: true });

  console.log("Building client...");
  execSync("npx vite build", { stdio: "inherit" });

  console.log("Build complete!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
