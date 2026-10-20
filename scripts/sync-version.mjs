// Run by the npm "version" lifecycle: copies package.json's version into
// src-tauri/Cargo.toml so every manifest agrees before npm commits and tags.
import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));

const cargoPath = "src-tauri/Cargo.toml";
const cargo = readFileSync(cargoPath, "utf8");
writeFileSync(cargoPath, cargo.replace(/^version = ".*"$/m, `version = "${version}"`));

// Refresh the arborista entry in Cargo.lock without touching other deps.
execSync("cargo update --workspace --manifest-path src-tauri/Cargo.toml", { stdio: "inherit" });

execSync(`git add ${cargoPath} src-tauri/Cargo.lock`, { stdio: "inherit" });
