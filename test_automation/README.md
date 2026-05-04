# IT3040 – Assignment 1 | Option 1 | Playwright Test Suite

## Overview

This project automates **50 negative test cases** for the Chat Sinhala transliteration function at:
**https://www.pixelssuite.com/chat-translator**

All test cases verify scenarios where the system **fails** to correctly convert chat-style Singlish into Sinhala. The 50 cases cover all 24 Singlish input types specified in Appendix 1 of the assignment brief (at least 2 per type).

---

## Requirements

- **Node.js** v18 or higher
- **npm** v9 or higher
- Internet connection (tests run against the live site)

---

## Setup & Installation

### 1. Clone / download the repository

```bash
git clone <your-repo-url>
cd test_automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

---

## Running the Tests

### Run all 50 tests (headless)

```bash
npm test
```

### Run with browser visible (headed mode)

```bash
npm run test:headed
```

### View the HTML report after running

```bash
npm run test:report
```

---

## Project Structure

```
test_automation/
├── tests/
│   └── transliteration.spec.js   ← All 50 test cases
├── playwright.config.js           ← Playwright configuration
├── package.json
└── README.md
```

---

## Test Case Coverage

| Input Type | Test IDs |
|---|---|
| 1. Question forms | Neg_0001, Neg_0002 |
| 2. Command forms | Neg_0003, Neg_0004 |
| 3. Greetings | Neg_0005, Neg_0006 |
| 4. Requests | Neg_0007, Neg_0008 |
| 5. Responses | Neg_0009, Neg_0010 |
| 6. Repeated Words | Neg_0011, Neg_0012 |
| 7. Inputs with Punctuation Marks | Neg_0013, Neg_0014 |
| 8. Romanization / Spelling Variants | Neg_0015, Neg_0016 |
| 9. Isolated English Word Insertions | Neg_0017, Neg_0018 |
| 10. Multi-Word English Phrases | Neg_0019, Neg_0020 |
| 11. English Digital Terms | Neg_0021, Neg_0022 |
| 12. Platform/App Names | Neg_0023, Neg_0024 |
| 13. English Abbreviations/Acronyms | Neg_0025, Neg_0026 |
| 14. English Clipped Forms | Neg_0027, Neg_0028 |
| 15. Place Names Embedded | Neg_0029, Neg_0030 |
| 16. Person Names Embedded | Neg_0031, Neg_0032 |
| 17. Numbers and Numeric Suffixes | Neg_0033, Neg_0034 |
| 18. Currency | Neg_0035, Neg_0036 |
| 19. Time Formats | Neg_0037, Neg_0038 |
| 20. Dates | Neg_0039, Neg_0040 |
| 21. Units of Measurement | Neg_0041, Neg_0042 |
| 22. Slang and Casual Phrasing | Neg_0043, Neg_0044 |
| 23. Online Identifiers | Neg_0045, Neg_0046 |
| 24. Inputs Containing Emojis | Neg_0047, Neg_0048 |
| Free choice | Neg_0049, Neg_0050 |

---

## Notes

- Tests run sequentially (`workers: 1`) to avoid overloading the live site.
- Each test types input into the Chat Sinhala field and waits for real-time output.
- The test **passes** (in Playwright terms) when the actual output **differs** from the expected correct Sinhala — confirming the transliteration failure.
- Screenshots on failure are saved in `test-results/`.
