import { test } from "@jest/globals";
import { driver } from "./setup.js";

test("find and click wikipedia", async () => {
  const searchSelector = await driver.$("~Search Wikipedia");
  await searchSelector.waitForDisplayed({ timeout: 30_000 });
  await searchSelector.click();
}, 10_000);

test("find insert text", async () => {
  const insertTextSelector = await driver.$(
    'android=new UiSelector().resourceId("org.wikipedia.alpha:id/search_src_text")'
  );
  await insertTextSelector.waitForDisplayed({ timeout: 30_000 });
  const a = ['Wikipedia', 'Open Source', 'Java', 'Dogu', 'Test', 'Primer'];
  for (let i = 0; i < a.length; i++) {
    await insertTextSelector.addValue(a[i] as string);
    await driver.pause(1_000);
    await insertTextSelector.clearValue();
    await driver.pause(1_000);
  }
}, 99_000);

// test('expect to find "Wikipedia"', async () => {
//   const allProductsName = await driver.$$(`android.widget.TextView`);
//   expect(allProductsName.length).toBeGreaterThan(0);
// });
