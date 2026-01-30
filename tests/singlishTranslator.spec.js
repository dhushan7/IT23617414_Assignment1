import { test, expect } from '@playwright/test';


async function getOutput(page, expectedText) {
  const possibleSelectors = [
    'div[contenteditable="true"]',
    'textarea#output',
    'div.output-text',
    'div[class*="output"]'
  ];

  const waitOptions = { timeout: 20000 };

  async function waitForText(loc) {
    if (expectedText) {
      await expect(loc).toContainText(expectedText, waitOptions);
    } else {
      await page.waitForFunction(
        el => el && el.textContent.trim().length > 0,
        loc,
        waitOptions
      );
    }
    const text = await loc.textContent();
    return text ? text.trim() : '';
  }

  for (const selector of possibleSelectors) {
    const loc = page.locator(selector).first();
    try {
      const text = await waitForText(loc);
      if (text) return text;
    } catch {
      continue;
    }
  }

  for (const frame of page.frames()) {
    for (const selector of possibleSelectors) {
      const loc = frame.locator(selector).first();
      try {
        const text = await waitForText(loc);
        if (text) return text;
      } catch {
        continue;
      }
    }
  }

  return '';
}


const positiveCases = [
  { id: 1, input: "api kanna yamu", expected: "අපි කන්න යමු" },
  { id: 2, input: "mama gedara yanawa", expected: "මම ගෙදර යනවා" },
];

const negativeCases = [
  "mkd bn",
  "oya inne???",
  "mama 100$ gaththa",
  "time eka 10:30 pm",
  "call ekak danna",
  "zoom meeting eka",
  "api api api yamu",
  "-----",
  "2025-01-01",
  "hello oya kohomada bro"
];

test('UI Test - Clear input clears output', async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/');
  await page.fill('textarea', 'oya kohomada');
  await page.waitForTimeout(10000); 
  await page.fill('textarea', '');   
  const result = await getOutput(page);
  expect(result).toBe('');
});


positiveCases.forEach(tc => {
  test(`Positive TC${tc.id}: ${tc.input}`, async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');
    await page.fill('textarea', tc.input);
    const result = await getOutput(page, tc.expected); 
    expect(result).toContain(tc.expected);
  });
});


negativeCases.forEach((input, index) => {
  test(`Negative TC${index + 25}: ${input}`, async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');
    await page.fill('textarea', input);
    const result = await getOutput(page);
    expect(result).not.toMatch(/[අ-ෆ]/);
  });
});
