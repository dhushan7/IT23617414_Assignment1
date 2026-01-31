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
  { id: 1, input: "adha mama gedhara enavaa", expected: "අද මම ගෙදර එනවා" },
  { id: 2, input: "mama me dhavas vala asaniipen innee, namuth mata me vaeda tika karagannath oonaa", expected: "මම මෙ දවස් වල අසනීපෙන් ඉන්නේ, නමුත් මට මෙ වැඩ ටික කරගන්නත් ඕනා" },
  { id: 3, input: "oyaa yanavaa nam mama enne naee", expected: "ඔයා යනවා නම් මම එන්නෙ නෑ" },
  { id: 4, input: "oyaa mokakdha karanna hadhannee?", expected: "ඔයා  මොකක්ද කරන්න හදන්නේ?" },
  { id: 5, input: "mata dhaen kanna baee", expected: "මට දැන් කන්න බෑ" },
  { id: 6, input: "oyaa heta enna", expected: "ඔයා හෙට එන්න" },
  { id: 7, input: "suBha upandhinayak!", expected: "සුභ උපන්දිනයක්!" },
  { id: 8, input: "karuNaakarala mama venuven eeka karanna", expected: "කරුණාකරල මම වෙනුවෙන් ඒක කරන්න" },
  { id: 9, input: "mama udhee kaalaa aavee", expected: "මම උදේ කාලා ආවේ" },
  { id: 10, input: "hari hari oyaama kiyanna", expected: "හරි හරි ඔයාම කියන්න" },
  { id: 11, input: "mama iiye ee assignment eka kalaa", expected: "මම ඊයෙ ඒ assignment එක කලා" },
  { id: 12, input: "api kanna yamu", expected: "අපි කන්න යමු" },
  { id: 13, input: "oya kohedha inne?", expected: "ඔයා කොහෙද ඉන්නේ?" },
  { id: 14, input: "mama adha gedhara inne", expected: "මම අද ගෙදර ඉන්නේ" },
  { id: 15, input: "api ehenam adha aevidhinna yamu ", expected: "අපි එහෙනම් අද ඇවිදින්න යමු " },
  { id: 16, input: "mata ATM eken sallith gannath oonaa", expected: "මට ATM එකෙන් සල්ලි ගන්නත් ඕනා" },
  { id: 17, input: "adha paadama Zoom eken karannee", expected: "අද පාඩම Zoom එකෙන් කරන්නේ" },
  { id: 18, input: "mama udhe 8.30 AM enavaa", expected: "මම උදෙ 8.30 AM එනවා" },
  { id: 19, input: "'hmm,' oya mokakdha karanna hithan inne", expected: "'hmm,' ඔය මොකක්ද කරන්න හිතන් ඉන්නේ" },
  { id: 20, input: "adha lecture ekee version controlling kiyala dhunnaa", expected: "අද lecture එකේ version controlling කියල දුන්නා" },
  { id: 21, input: "mokadha karanne", expected: "මොකද කරන්නේ" },
  { id: 22, input: "me venakal kiyala dhunna padam valin assignment ekak dhenava kivva nisaa, ee paadam tika hodhata balaaganna. mokadha, ee assignment ekata 20 marks laebenavaa kivva. mokak hari prashnayak thiyeenam kiyanna mamath puluvan udhavvak karannam. thava eekata mee venakal karapu labs valinuth enava kivva, ee nisaa eevath hodhata balanna", expected: "මෙ වෙනකල් කියල දුන්න පඩම් වලින් assignment එකක් දෙනව කිව්ව නිසා, ඒ පාඩම් ටික හොදට බලාගන්න. මොකද, ඒ assignment එකට 20 marks ලැබෙනවා කිව්ව. මොකක් හරි ප්‍රශ්නයක් තියේනම් කියන්න මමත් පුලුවන් උදව්වක් කරන්නම්. තව ඒකට මේ වෙනකල් කරපු labs වලිනුත් එනව කිව්ව, ඒ නිසා ඒවත් හොදට බලන්න" },
  { id: 23, input: "oya saniipen aethi kiyala hithanavaa", expected: "ඔය සනීපෙන් ඇති කියල හිතනවා" },
  { id: 24, input: "eyaala eevi", expected: "එයාල ඒවි" },
  { id: 25, input: "bank eken ena OTP kaatavath dhenna epaa", expected: "bank එකෙන් එන OTP කාටවත් දෙන්න එපා" },
];

const negativeCases = [
  "apihetaassignmentekakaramuehenam",
  "tnx bro",
  "api api api yamu",
  "'_@#--",
  "01/01/2025",
  "mama ATM eken 100$ gaththa",
  "mama gedara yanavaa. api heta enavaa!!! $$$ 10:30pm",
  "මම gedara yanawa",
  "godak sthuthi!!!!!!!!!",
  "API wada karanawada"
];

test('Neg_UI_0001 - Empty input validation', async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/');
  await page.fill('textarea', '');
  const output = await getOutput(page);
  expect(output).not.toMatch(/[අ-ෆ]/);
});

test('Pos_UI_0002 - Output refresh on input change', async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/');
  await page.fill('textarea', 'mama heta enavaa');
  const output = await getOutput(page);
  expect(output).toMatch(/[අ-ෆ]/);
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
