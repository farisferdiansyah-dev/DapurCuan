import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    channel: "msedge",
    headless: true,
    trace: "off",
  },
  projects: [
    {
      name: "msedge",
      use: {
        channel: "msedge",
      },
    },
  ],
});
