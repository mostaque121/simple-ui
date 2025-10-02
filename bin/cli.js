#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_FILE = path.join(process.cwd(), "simple-ui.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, ans => resolve(ans)));
}

function alreadyInitialized() {
  return existsSync(CONFIG_FILE);
}

// Copy template component with overwrite prompt
async function copyTemplate(fileName, destFolder = "components/ui") {
  const src = path.join(__dirname, "../templates", `${fileName}.tsx`);
  if (!existsSync(src)) {
    console.error(`❌ Component "${fileName}" not found in templates`);
    process.exit(1);
  }

  const dest = path.join(process.cwd(), destFolder, `${fileName}.tsx`);
  mkdirSync(path.dirname(dest), { recursive: true });

  if (existsSync(dest)) {
    const ans = await ask(`⚠ ${fileName} already exists. Replace? (y/n): `);
    if (ans.toLowerCase() === "y") {
      copyFileSync(src, dest);
      console.log(`✅ Replaced ${fileName}`);
      return true;
    } else {
      console.log(`⚠ Skipped ${fileName}`);
      return false;
    }
  } else {
    copyFileSync(src, dest);
    console.log(`✅ Added ${fileName}`);
    return true;
  }
}

// Copy or update cn function in lib/utils.js
function copyCNFunction() {
  const utilsFolder = path.join(process.cwd(), "lib");
  mkdirSync(utilsFolder, { recursive: true });
  const utilsFile = path.join(utilsFolder, "utils.ts");

  const cnContent = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names intelligently
 * Handles conditional classes, duplicates, and Tailwind conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

`;

  let content = "";
  if (existsSync(utilsFile)) {
    content = readFileSync(utilsFile, "utf8");
    // replace existing cn function if present
    if (content.includes("export function cn")) {
      content = content.replace(/export function cn[\s\S]*?\}\n/, cnContent);
      writeFileSync(utilsFile, content);
      console.log("⚡ Replaced existing cn function in lib/utils.ts");
      return;
    }
  }
  // create or append
  writeFileSync(utilsFile, cnContent);
  console.log("✅ Added lib/utils.js with cn function");
}

// Update globals.css safely
function updateGlobalsCSS() {
  const cssFile = path.join(process.cwd(), "app/globals.css");
  let content = existsSync(cssFile) ? readFileSync(cssFile, "utf8") : "";

  // Lines to ensure
  const linesToAdd = [
    '@import "tailwindcss";',
    '@import "tw-animate-css";',
    '@custom-variant dark (&:is(.dark *));'
  ];

  linesToAdd.forEach(line => {
    if (!content.includes(line)) content = line + "\n" + content;
  });

  // Full custom properties (as provided by you)
  const customProps = `
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`;

  if (!content.includes(customProps)) {
    content += `\n${customProps}`;
  }

  writeFileSync(cssFile, content);
  console.log("✅ Updated globals.css");
}

// Update simple-ui.json config
function updateConfig(componentName) {
  let config = alreadyInitialized()
    ? JSON.parse(readFileSync(CONFIG_FILE, "utf8"))
    : { components: [], aliases: {} };

  if (!config.components.includes(componentName)) {
    config.components.push(componentName);
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log("✅ Updated simple-ui.json");
  }
}

async function main() {
  const command = process.argv[2];
  const name = process.argv[3];

  if (command === "init") {
    if (alreadyInitialized()) {
      console.log("⚠ Simple UI already initialized. Skipping...");
    } else {
      console.log("⚡ Initializing Simple UI...");

      updateGlobalsCSS();
      copyCNFunction();

      const config = {
        tailwindCSS: "app/globals.css",
        aliases: {
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks"
        },
        components: []
      };
      writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
      console.log("✅ Created simple-ui.json");

      console.log("🎉 Simple UI setup complete!");
    }
  }
  else if (command === "add" && name) {
    const added = await copyTemplate(name);
    if (added) updateConfig(name);
  }
  else {
    console.log(`
Usage:
  simple-ui init           → setup configs
  simple-ui add <name>     → add a component
`);
  }

  rl.close();
}

main();
