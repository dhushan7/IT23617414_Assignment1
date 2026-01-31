import { test, expect } from '@playwright/test';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const testCases = [
  { id: 'Pos_001', input: 'adha mama gedhara enavaa', expected: 'අද මම ගෙදර එනවා' },
  { id: 'Pos_002', input: 'mama me dhavas vala asaniipen innee, namuth mata me vaeda tika karagannath oonaa', expected: 'මම මෙ දවස් වල අසනීපෙන් ඉන්නේ, නමුත් මට මෙ වැඩ ටික කරගන්නත් ඕනා' },
  { id: 'Pos_003', input: 'oyaa yanavaa nam mama enne naee', expected: 'ඔයා යනවා නම් මම එන්නෙ නෑ' },
  { id: 'Pos_004', input: 'oyaa mokakdha karanna hadhannee?', expected: 'ඔයා  මොකක්ද කරන්න හදන්නේ?' },
  { id: 'Pos_005', input: 'mata dhaen kanna baee', expected: 'මට දැන් කන්න බෑ' },
  { id: 'Pos_006', input: 'oyaa heta enna', expected: 'ඔයා හෙට එන්න' },
  { id: 'Pos_007', input: 'suBha upandhinayak!', expected: 'සුභ උපන්දිනයක්!' },
  { id: 'Pos_008', input: 'karuNaakarala mama venuven eeka karanna', expected: 'කරුණාකරල මම වෙනුවෙන් ඒක කරන්න' },
  { id: 'Pos_009', input: 'mama udhee kaalaa aavee', expected: 'මම උදේ කාලා ආවේ' },
  { id: 'Pos_010', input: 'hari hari oyaama kiyanna', expected: 'හරි හරි ඔයාම කියන්න' },
  { id: 'Pos_011', input: 'mama iiye ee assignment eka kalaa', expected: 'මම ඊයෙ ඒ assignment එක කලා' },
  { id: 'Pos_012', input: 'api kanna yamu', expected: 'අපි කන්න යමු' },
  { id: 'Pos_013', input: 'oya kohedha inne?', expected: 'ඔයා කොහෙද ඉන්නේ?' },
  { id: 'Pos_014', input: 'mama adha gedhara inne', expected: 'මම අද ගෙදර ඉන්නේ' },
  { id: 'Pos_015', input: 'api ehenam adha aevidhinna yamu ', expected: 'අපි එහෙනම් අද ඇවිදින්න යමු ' },
  { id: 'Pos_016', input: 'mata ATM eken sallith gannath oonaa', expected: 'මට ATM එකෙන් සල්ලි ගන්නත් ඕනා' },
  { id: 'Pos_017', input: 'adha paadama Zoom eken karannee', expected: 'අද පාඩම Zoom එකෙන් කරන්නේ' },
  { id: 'Pos_018', input: 'mama udhe 8.30 AM enavaa', expected: 'මම උදෙ 8.30 AM එනවා' },
  { id: 'Pos_019', input: "'hmm,' oya mokakdha karanna hithan inne", expected: "'hmm,' ඔය මොකක්ද කරන්න හිතන් ඉන්නේ" },
  { id: 'Pos_020', input: 'adha lecture ekee version controlling kiyala dhunnaa', expected: 'අද lecture එකේ version controlling කියල දුන්නා' },
  { id: 'Pos_021', input: 'mokadha karanne', expected: 'මොකද කරන්නේ' },
  { id: 'Pos_022', input: 'me venakal kiyala dhunna padam valin assignment ekak dhenava kivva nisaa, ee paadam tika hodhata balaaganna. mokadha, ee assignment ekata 20 marks laebenavaa kivva. mokak hari prashnayak thiyeenam kiyanna mamath puluvan udhavvak karannam. thava eekata mee venakal karapu labs valinuth enava kivva, ee nisaa eevath hodhata balanna', expected: 'මෙ වෙනකල් කියල දුන්න පාඩම් වලින් assignment එකක් දෙනව කිව්ව නිසා, ඒ පාඩම් ටික හොදට බලාගන්න. මොකද, ඒ assignment එකට 20 marks ලැබෙනවා කිව්ව. මොකක් හරි ප්‍රශ්නයක් තියේනම් කියන්න මමත් පුලුවන් උදව්වක් කරන්නම්. තව ඒකට මේ වෙනකල් කරපු labs වලිනුත් එනව කිව්ව, ඒ නිසා ඒවත් හොදට බලන්න' },
  { id: 'Pos_023', input: 'oya saniipen aethi kiyala hithanavaa', expected: 'ඔය සනීපෙන් ඇති කියල හිතනවා' },
  { id: 'Pos_024', input: 'eyaala eevi', expected: 'එයාල ඒවි' },
  { id: 'Pos_025', input: 'bank eken ena OTP kaatavath dhenna epaa', expected: 'bank එකෙන් එන OTP කාටවත් දෙන්න එපා' },

  { id: 'Neg_001', input: 'apihetaassignmentekakaramuehenam', expected: '' },
  { id: 'Neg_002', input: 'tnx bro', expected: '' },
  { id: 'Neg_003', input: 'api api api yamu', expected: '' },
  { id: 'Neg_004', input: "'_@#--", expected: '' },
  { id: 'Neg_005', input: '01/01/2025', expected: '' },
  { id: 'Neg_006', input: 'mama ATM eken 100$ gaththa', expected: '' },
  { id: 'Neg_007', input: 'mama gedara yanavaa. api heta enavaa!!! $$$ 10:30pm', expected: '' },
  { id: 'Neg_008', input: 'මම gedara yanawa', expected: '' },
  { id: 'Neg_009', input: 'godak sthuthi!!!!!!!!!', expected: '' },
  { id: 'Neg_010', input: 'API wada karanawada', expected: '' },

  { id: 'UI_001', input: '', expected: '' },
  { id: 'UI_002', input: 'mama heta enavaa', expected: 'මම හෙට එනවා' }
];


async function getInputField(page) {
  return page.locator('textarea').first();
}

async function getSinhalaOutput(page) {
  const elements = await page.locator('textarea, div, span, p').all();
  let longest = '';

  for (const el of elements) {
    const text = (await el.textContent())?.trim();
    if (text && /[\u0D80-\u0DFF]/.test(text) && text.length > longest.length) {
      longest = text;
    }
  }
  return longest || '';
}

test.describe('Singlish Translator', () => {
  const resultsDir = join(__dirname, 'results');
  const results = [];

  if (!existsSync(resultsDir)) {
    mkdirSync(resultsDir, { recursive: true });
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.swifttranslator.com/');
    await page.waitForLoadState('networkidle');
  });

  for (const tc of testCases) {
    test(`${tc.id} | ${tc.type} | ${tc.input}`, async ({ page }, testInfo) => {
      let actual = '';
      let status = 'Fail';

      try {
        const inputField = await getInputField(page);
        await inputField.fill(tc.input);
        await page.waitForTimeout(1500);

        actual = await getSinhalaOutput(page);

        const cleanActual = actual.replace(/[^\u0D80-\u0DFF]/g, '');
        const cleanExpected = tc.expected.replace(/[^\u0D80-\u0DFF]/g, '');

        if (tc.type === 'positive' && cleanActual.includes(cleanExpected)) {
          status = 'Pass';
        }

        if (tc.type === 'negative' && !/[\u0D80-\u0DFF]/.test(actual)) {
          status = 'Pass';
        }

        if (tc.type === 'ui') {
          if ((tc.input === '' && actual === '') || actual === tc.expected) {
            status = 'Pass';
          }
        }

      } catch (err) {
        actual = `ERROR: ${err.message}`;
      }

      results.push({
        id: tc.id,
        input: tc.input,
        expected: tc.expected,
        actual,
        status
      });
    });
  }

  test.afterAll(() => {
    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'Pass').length,
      failed: results.filter(r => r.status === 'Fail').length,
      timestamp: new Date().toISOString()
    };

    writeFileSync(join(resultsDir, 'summary.json'), JSON.stringify(summary, null, 2));
    writeFileSync(join(resultsDir, 'results.json'), JSON.stringify(results, null, 2));

    console.log('Test results saved...');
  });
});
