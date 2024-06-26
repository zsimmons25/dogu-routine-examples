import { beforeAll, afterAll } from "@jest/globals";
import {
  DeviceHostClient,
  isAllowedBrowserName,
  isAllowedBrowserPlatform,
} from "dogu-device-client";
import webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";
import edge from "selenium-webdriver/edge";
import safari from "selenium-webdriver/safari";
import { config } from "dotenv";

config({ path: ".env.local" });

const Serial = process.env["DOGU_DEVICE_SERIAL"];
const DeviceServerPort = parseInt(
  process.env["DOGU_DEVICE_SERVER_PORT"] ?? "5001"
);
const DevicePlatform = process.env["DOGU_DEVICE_PLATFORM"];
const BrowserName = process.env["DOGU_BROWSER_NAME"];
const BrowserVersion = process.env["DOGU_BROWSER_VERSION"] ?? "latest";

if (!Serial) {
  throw new Error("DOGU_DEVICE_SERIAL is not specified");
}

if (!DevicePlatform) {
  throw new Error("DOGU_DEVICE_PLATFORM is not specified");
}

if (!BrowserName) {
  throw new Error("DOGU_BROWSER_NAME is not specified");
}

if (!isAllowedBrowserName(BrowserName)) {
  throw new Error(`DOGU_BROWSER_NAME is not allowed: ${BrowserName}`);
}

if (!isAllowedBrowserPlatform(DevicePlatform)) {
  throw new Error(`DOGU_DEVICE_PLATFORM is not allowed: ${DevicePlatform}`);
}

export let driver: webdriver.ThenableWebDriver;

beforeAll(async () => {
  const host = new DeviceHostClient({
    port: DeviceServerPort,
    timeout: 10 * 60_000,
  });
  console.log("ensure browser and driver");
  const browserResult = await host.ensureBrowserAndDriver({
    browserName: BrowserName,
    browserVersion: BrowserVersion,
    browserPlatform: DevicePlatform,
  });
  console.log("ensure browser and driver done", browserResult);

  const { browserName, browserPath, browserDriverPath } = browserResult;
  if (!browserPath) {
    throw new Error("browserPath is not specified");
  }

  if (browserName === "chrome") {
    // wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    const chromeServiceBuilder = new chrome.ServiceBuilder(browserDriverPath);
    const chromeOptions = new chrome.Options();
    chromeOptions.setChromeBinaryPath(browserPath);
    chromeOptions.addArguments("--start-maximized");
    driver = new webdriver.Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .setChromeService(chromeServiceBuilder)
      .build();
  } else if (browserName === "firefox") {
    const firefoxServiceBuilder = new firefox.ServiceBuilder(browserDriverPath);
    const firefoxOptions = new firefox.Options();
    firefoxOptions.setBinary(browserPath);
    driver = new webdriver.Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(firefoxOptions)
      .setFirefoxService(firefoxServiceBuilder)
      .build();
  } else if (browserName === "edge") {
    const edgeServiceBuilder = new edge.ServiceBuilder(browserDriverPath);
    const edgeOptions = new edge.Options();
    edgeOptions.setEdgeChromiumBinaryPath(browserPath);
    driver = new webdriver.Builder()
      .forBrowser("MicrosoftEdge")
      .setEdgeOptions(edgeOptions)
      .setEdgeService(edgeServiceBuilder)
      .build();
  } else if (browserName === "safari") {
    const safariOptions = new safari.Options();
    driver = new webdriver.Builder()
      .forBrowser("safari")
      .setSafariOptions(safariOptions)
      .build();
  } else {
    throw new Error(`unsupported browser: ${browserName}`);
  }
});

afterAll(async () => {
  await driver?.close();
});
