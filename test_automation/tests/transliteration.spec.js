// Playwright Test Suite — IT3040 Assignment 1 Option 1
// Tests the Chat Sinhala transliteration at https://www.pixelssuite.com/chat-translator
// All 50 test cases are NEGATIVE — expected to FAIL transliteration

const { test, expect } = require('@playwright/test');

const URL = 'https://www.pixelssuite.com/chat-translator';

// Selector for the Chat Sinhala input field and output area
// These selectors target the Chat Sinhala mode specifically
const INPUT_SELECTOR  = 'textarea[placeholder], input[type="text"]';
const OUTPUT_SELECTOR = '.output, .result, [class*="output"], [class*="result"], [class*="sinhala"]';

// Helper: navigate to page, switch to Chat Sinhala mode, type input, get output
async function runTransliteration(page, input) {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });

  // Select "Chat Sinhala" mode if a mode toggle exists
  try {
    const chatBtn = page.locator('button, label, [role="tab"]').filter({ hasText: /chat/i });
    if (await chatBtn.count() > 0) await chatBtn.first().click();
  } catch (_) {}

  // Find the input field
  const inputField = page.locator('textarea').first();
  await inputField.waitFor({ timeout: 10000 });
  await inputField.click();
  await inputField.fill('');
  await inputField.type(input, { delay: 50 });

  // Wait for real-time output to appear (the app transliterates without a button press)
  await page.waitForTimeout(2000);

  // Capture actual output — try multiple likely selectors
  let actualOutput = '';
  const candidates = [
    page.locator('[class*="output"]').first(),
    page.locator('[class*="result"]').first(),
    page.locator('[class*="sinhala"]').first(),
    page.locator('textarea').nth(1),
    page.locator('input[readonly]').first(),
  ];
  for (const el of candidates) {
    try {
      if (await el.count() > 0) {
        const text = (await el.inputValue().catch(() => '')) || (await el.textContent().catch(() => ''));
        if (text && text.trim().length > 0) {
          actualOutput = text.trim();
          break;
        }
      }
    } catch (_) {}
  }

  return actualOutput;
}

// ──────────────────────────────────────────────────────────────
// TEST CASES
// ──────────────────────────────────────────────────────────────

const testCases = [
  // 1. Question forms
  { id: 'Neg_0001', length: 'S', input: 'mokada karanne nethuwa inna?',                                  expected: 'මොකද කරන්නේ නැතුව ඉන්න?',                                              type: 'Question forms' },
  { id: 'Neg_0002', length: 'S', input: 'kawda giya eye enne naththe?',                                  expected: 'කාවද ගියා ඒ එන්නේ නැත්තේ?',                                            type: 'Question forms' },
  // 2. Command forms
  { id: 'Neg_0003', length: 'S', input: 'wahagena inne na, elabbe.',                                     expected: 'වහගෙන ඉන්නේ නෑ, එලාබ්බේ.',                                              type: 'Command forms' },
  { id: 'Neg_0004', length: 'M', input: 'poddak us wela katha karanna, ne balagena.',                    expected: 'පොඩ්ඩක් උස් වෙලා කතා කරන්න, නේ බලාගෙන.',                               type: 'Command forms' },
  // 3. Greetings
  { id: 'Neg_0005', length: 'M', input: 'Subha Aluth Awuruddak wewa bro!',                               expected: 'සුභ අලුත් අවුරුද්දක් වේවා bro!',                                          type: 'Greetings' },
  { id: 'Neg_0006', length: 'M', input: 'Kohomada machan, kalin danagath nehe!',                         expected: 'කොහොමද මචන්, කලින් දැනගත්ත නෑ!',                                         type: 'Greetings' },
  // 4. Requests
  { id: 'Neg_0007', length: 'M', input: 'Meka poddak harikarala dapan, neda?',                           expected: 'මේක පොඩ්ඩක් හරිකරලා දාපන්, නේද?',                                        type: 'Requests' },
  { id: 'Neg_0008', length: 'M', input: 'Eka api ekka balamu, karunakarala ehema karanna bari unoth kiyanna.', expected: 'ඒක අපි එක්ක බලමු, කරුණාකරලා එහෙම කරන්න බෑ උනොත් කියන්න.',   type: 'Requests' },
  // 5. Responses
  { id: 'Neg_0009', length: 'S', input: 'nah nah, mama eka danne nehe.',                                 expected: 'නෑ නෑ, මම ඒක දන්නේ නෑ.',                                                  type: 'Responses' },
  { id: 'Neg_0010', length: 'M', input: 'hodama karannam, ane chinna problem ekak.',                      expected: 'හොදාම කරන්නම්, අනේ චින්න ප්‍රොබ්ලම් එකක්.',                             type: 'Responses' },
  // 6. Repeated Words
  { id: 'Neg_0011', length: 'S', input: 'boru boru katha karanna epa.',                                  expected: 'බොරු බොරු කතා කරන්න එපා.',                                              type: 'Repeated Words' },
  { id: 'Neg_0012', length: 'M', input: 'eka eka thiyagena inna, wage wage karanna epa.',                expected: 'ඒක ඒක තියාගෙන ඉන්න, වගේ වගේ කරන්න එපා.',                              type: 'Repeated Words' },
  // 7. Punctuation
  { id: 'Neg_0013', length: 'M', input: 'mama yannam… bt oyath enavada??',                               expected: 'මම යන්නම්… bt ඔයාත් එනවද??',                                            type: 'Inputs with Punctuation Marks' },
  { id: 'Neg_0014', length: 'M', input: 'ane! meka hodai… bt ammata kiyanna epa!',                       expected: 'අනේ! මේක හොදයි… bt අම්මාට කියන්න එපා!',                                 type: 'Inputs with Punctuation Marks' },
  // 8. Romanization / Spelling Variants
  { id: 'Neg_0015', length: 'S', input: 'mn oyt psee kth krnn.',                                         expected: 'මං ඔයාට පස්සේ කතා කරන්න.',                                              type: 'Romanization / Spelling Variants' },
  { id: 'Neg_0016', length: 'M', input: 'apee ratata adrei, lankawe aadarei.',                            expected: 'අපේ රටට ආදරෙයි, ලංකාවේ ආදරෙයි.',                                        type: 'Romanization / Spelling Variants' },
  // 9. Isolated English Word Insertions
  { id: 'Neg_0017', length: 'M', input: 'mama ada gym gihin super tired.',                               expected: 'මම අද gym ගිහින් super tired.',                                          type: 'Isolated English Word Insertions in Singlish' },
  { id: 'Neg_0018', length: 'M', input: 'api heta beach ekka yamuda, weather hodai kiyala danawa.',       expected: 'අපි හෙට beach එක්ක යමුද, weather හොදයි කියලා දනවා.',                    type: 'Isolated English Word Insertions in Singlish' },
  // 10. Multi-Word English Phrases
  { id: 'Neg_0019', length: 'M', input: 'mama so done with this, api yamu.',                             expected: 'මම so done with this, අපි යමු.',                                         type: 'Multi-Word English Phrases in Singlish' },
  { id: 'Neg_0020', length: 'M', input: "let me know when you're free, mama phone karannam.",            expected: "let me know when you're free, මම phone කරන්නම්.",                        type: 'Multi-Word English Phrases in Singlish' },
  // 11. English Digital Terms
  { id: 'Neg_0021', length: 'M', input: 'oyage bluetooth eka on karanna puluwanda?',                     expected: 'ඔයාගේ bluetooth එක on කරන්න පුළුවන්ද?',                                 type: 'English Digital Terms in Singlish' },
  { id: 'Neg_0022', length: 'M', input: 'mage phone eke storage full wela.',                             expected: 'මගේ phone එකේ storage full වෙලා.',                                       type: 'English Digital Terms in Singlish' },
  // 12. Platform/App Names
  { id: 'Neg_0023', length: 'M', input: 'Instagram eke DM ekakata reply karanna.',                       expected: 'Instagram එකේ DM එකට reply කරන්න.',                                     type: 'Platform/App Names in Singlish' },
  { id: 'Neg_0024', length: 'M', input: 'Google Maps eken balanna koheda yanne kiyala.',                 expected: 'Google Maps එකෙන් බලන්න කොහේද යන්නේ කියලා.',                           type: 'Platform/App Names in Singlish' },
  // 13. Abbreviations/Acronyms
  { id: 'Neg_0025', length: 'M', input: 'mage DOB eka January 5 kiyala form ekata dappu.',               expected: 'මගේ DOB එක January 5 කියලා form එකට දාප්පු.',                          type: 'English Abbreviations/Acronyms in Singlish' },
  { id: 'Neg_0026', length: 'S', input: 'ETA koheda? GPS eke hondatama nehe.',                           expected: 'ETA කොහේද? GPS එකේ හොඳටම නෑ.',                                          type: 'English Abbreviations/Acronyms in Singlish' },
  // 14. Clipped Forms
  { id: 'Neg_0027', length: 'S', input: 'mama heta uni yanna one.',                                      expected: 'මම හෙට uni යන්න ඕනේ.',                                                  type: 'English Clipped Forms in Singlish' },
  { id: 'Neg_0028', length: 'M', input: 'eya lab eke project eka submit karapu neda?',                   expected: 'එයා lab එකේ project එක submit කරාපු නේද?',                             type: 'English Clipped Forms in Singlish' },
  // 15. Place Names
  { id: 'Neg_0029', length: 'M', input: 'Nuwaraeliya yanna eka plan karamu, kohomada?',                  expected: 'නුවරඑළිය යන්න ඒක plan කරමු, කොහොමද?',                                   type: 'Place Names Embedded in Singlish' },
  { id: 'Neg_0030', length: 'M', input: 'mama Dehiwala sita Maharagama yanawa bus eken.',                expected: 'මම දෙහිවල සිට මහරගම යනවා bus එකෙන්.',                                   type: 'Place Names Embedded in Singlish' },
  // 16. Person Names
  { id: 'Neg_0031', length: 'M', input: 'Dhanushka hari supiriyata gehuwa, machan.',                     expected: 'ධනුශ්ක හරි සුපිරියට ගැහුවා, මචන්.',                                      type: 'Person Names Embedded in Singlish' },
  { id: 'Neg_0032', length: 'M', input: 'Tharushi saha Sachini dennama late awe.',                       expected: 'තරුෂී සහ සාචිනී දෙන්නම late ආවේ.',                                       type: 'Person Names Embedded in Singlish' },
  // 17. Numbers and Numeric Suffixes
  { id: 'Neg_0033', length: 'M', input: 'lamaya 3rd place aragena wela happy.',                          expected: 'ළමයා 3rd place අරගෙන වෙලා happy.',                                       type: 'Inputs with Numbers and Numeric Suffixes' },
  { id: 'Neg_0034', length: 'M', input: 'api 2nd dawasa Galle fort balanna giha.',                       expected: 'අපි 2nd දවස Galle fort බලන්න ගිහා.',                                    type: 'Inputs with Numbers and Numeric Suffixes' },
  // 18. Currency
  { id: 'Neg_0035', length: 'M', input: 'Rs. 850k witharada ekka yanna?',                                expected: 'Rs. 850k විතරද එක්ක යන්න?',                                              type: 'Inputs with Currency' },
  { id: 'Neg_0036', length: 'M', input: 'GBP 120 kiyanne rupiyel walin kochcharada hemadama?',           expected: 'GBP 120 කියන්නේ රුපියල් වලින් කොච්චරද හැමදාම?',                       type: 'Inputs with Currency' },
  // 19. Time Formats
  { id: 'Neg_0037', length: 'M', input: 'api 6:45AM patan practice karanawa.',                           expected: 'අපි 6:45AM පටන් practice කරනවා.',                                       type: 'Inputs with Time Formats' },
  { id: 'Neg_0038', length: 'M', input: 'class eka 8.15am walata ewanawa, hodatama enna.',                expected: 'class එක 8.15am වලට එනවා, හොඳටම එන්න.',                                 type: 'Inputs with Time Formats' },
  // 20. Dates
  { id: 'Neg_0039', length: 'M', input: 'interview eka March 3rd walata fix una.',                       expected: 'interview එක March 3rd වලට fix උනා.',                                   type: 'Inputs with Dates' },
  { id: 'Neg_0040', length: 'M', input: 'mama 2026/05/10 walata gihin ena.',                             expected: 'මම 2026/05/10 වලට ගිහින් එනා.',                                         type: 'Inputs with Dates' },
  // 21. Units of Measurement
  { id: 'Neg_0041', length: 'M', input: 'e package eke bara 2.5kg witharai.',                            expected: 'ඒ package එකේ බර 2.5kg විතරයි.',                                         type: 'Inputs with Unit of Measurements' },
  { id: 'Neg_0042', length: 'M', input: 'pool eke depth eka mita 1.8m kiyala kiwwa.',                    expected: 'pool එකේ depth එක මිට 1.8m කියලා කිව්වා.',                             type: 'Inputs with Unit of Measurements' },
  // 22. Slang and Casual Phrasing
  { id: 'Neg_0043', length: 'M', input: 'adooo, uba meka kohomada karala thibba?',                       expected: 'අදෝෝෝ, උඹ මේක කොහොමද කරලා තිබ්බා?',                                    type: 'Inputs with Slang and Casual Phrasing' },
  { id: 'Neg_0044', length: 'M', input: 'kiri kella, habai eya thamata pissuda?',                        expected: 'කිරි කෙල්ල, හාබායි එයා තමාටම පිස්සුද?',                                  type: 'Inputs with Slang and Casual Phrasing' },
  // 23. Online Identifiers
  { id: 'Neg_0045', length: 'M', input: 'mata meka check karanna: fb.com/groups/lk',                     expected: 'මට මේක check කරන්න: fb.com/groups/lk',                                   type: 'Online Identifiers in Singlish' },
  { id: 'Neg_0046', length: 'M', input: '@Kasun_Dev oyata pull request eka approve karanna.',            expected: '@Kasun_Dev ඔයාට pull request එක approve කරන්න.',                       type: 'Online Identifiers in Singlish' },
  // 24. Emojis
  { id: 'Neg_0047', length: 'M', input: 'Uba api ekka enawa neda 🤙 mata kiyanna.',                       expected: 'උඹ අපි එක්ක එනවා නේද 🤙 මට කියන්න.',                                     type: 'Inputs Containing Emojis' },
  { id: 'Neg_0048', length: 'M', input: 'Ada super tired 😴💤 gedera gihilla kapanawa.',                    expected: 'අද super tired 😴💤 ගෙදර ගිහිල්ලා කපනවා.',                              type: 'Inputs Containing Emojis' },
  // Free choice cases
  { id: 'Neg_0049', length: 'M', input: 'api heta after work coffee yamuda?',                            expected: 'අපි හෙට after work coffee යමුද?',                                        type: 'Isolated English Word Insertions in Singlish' },
  { id: 'Neg_0050', length: 'M', input: 'nangi, uba genuinely hoda lamayekda?',                          expected: 'නංගී, උඹ genuinely හොද ළමයෙක්ද?',                                       type: 'Inputs with Slang and Casual Phrasing' },
];

// Generate a test for each case
for (const tc of testCases) {
  test(`${tc.id} - ${tc.type}`, async ({ page }) => {
    const actual = await runTransliteration(page, tc.input);

    // We expect these to FAIL — i.e., actual output should NOT match expected
    // The test "passes" in Playwright terms when we can confirm the mismatch
    console.log(`\n[${tc.id}] Input   : ${tc.input}`);
    console.log(`[${tc.id}] Expected: ${tc.expected}`);
    console.log(`[${tc.id}] Actual  : ${actual}`);

    // Assert that the actual output differs from the expected (confirming the bug)
    expect(actual).not.toBe(tc.expected);
  });
}
