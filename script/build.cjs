const { execSync } = require("child_process");
const { rmSync } = require("fs");

try {
  console.log("Cleaning dist...");
  rmSync("dist", { recursive: true, force: true });

  console.log("Building client...");
  execSync("npx vite build", { stdio: "inherit" });

  console.log("Copying server files...");
  execSync("cp -r server dist/", { stdio: "inherit" });
  execSync("cp -r shared dist/", { stdio: "inherit" });

  console.log("Build complete!");
} catch (error) {
  console.error("Build failed:", error.message);
  process.exit(1);
}
