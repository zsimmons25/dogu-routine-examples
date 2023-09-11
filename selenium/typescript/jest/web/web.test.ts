import { test, expect } from "@jest/globals";
import { driver } from "./setup.js";

test(
  "go to dogutech.io",
  async () => {
    await driver.get("https://dogutech.io");
  },
  5 * 60_000
);

test("find Dogu elements", async () => {
  const doguElements = await driver.findElements({
    xpath: "//*[contains(text(), 'Dogu')]",
  });
  expect(doguElements.length).toBeGreaterThan(0);
});

test('Feature test', async () => {
  await driver.actions().click(await driver.findElement({xpath: '//button[@id="main-feature-execution-button"]'})).perform();
  await driver.sleep(1000);
  await driver.actions().click(await driver.findElement({xpath: '//button[@id="main-feature-report-button"]'})).perform();
  await driver.sleep(1000);
  await driver.actions().click(await driver.findElement({xpath: '//button[@id="main-feature-integration-button"]'})).perform();
  await driver.sleep(1000);
})

test('demo test', async () => {
  await driver.actions().click(await driver.findElement({xpath: '//button[@id="main-bottom-book-demo-button"]'})).perform();
  await driver.sleep(1000);
  await driver.actions().click(await driver.findElement({xpath: '//input[@id="lastname"]'})).perform();
  await driver.actions().sendKeys('Dogu').perform();
  await driver.actions().click(await driver.findElement({xpath: '//input[@id="firstname"]'})).perform();
  await driver.actions().sendKeys('Technologies').perform();
  await driver.actions().click(await driver.findElement({xpath: '//input[@id="email"]'})).perform();
  await driver.actions().sendKeys('test@dogutech.io').perform();
  await driver.actions().click(await driver.findElement({xpath: '//input[@id="category"]'})).perform();
  await driver.sleep(1000);
  const elems = await driver.findElements({xpath: '//dic[@class="ant-select-item ant-select-item-option ant-select-item-option-active"]'});
  await driver.actions().click(elems[0]).click().perform();
  await driver.sleep(1000);
  await driver.actions().click(await driver.findElement({xpath: '//textarea[@id="message"]'})).perform();
  await driver.actions().sendKeys('test').perform();
  await driver.actions().click(await driver.findElement({xpath: '//button[@type="submit"]'})).perform();
})
