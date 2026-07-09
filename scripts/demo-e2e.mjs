// Browser E2E of the recorded demo: drives the real UI through beats 1–4 in
// headless Chrome (two tabs = the two demo windows). Run with the stack up:
//
//   pnpm demo:up        # terminal 1
//   pnpm demo:e2e       # terminal 2
//
// NOTE: consumes chain state — re-run `pnpm demo:up` before recording.
// Requires Google Chrome at the standard macOS path (uses puppeteer-core).
import puppeteer from "puppeteer-core";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DELIVERABLE = path.join(mkdtempSync(path.join(tmpdir(), "trustpay-e2e-")), "deliverable.txt");
writeFileSync(DELIVERABLE, "TrustPay demo deliverable — milestone 1\n");

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

async function newPage(url) {
  const p = await browser.newPage();
  p.on("pageerror", (e) => console.log("  [pageerror]", String(e).slice(0, 200)));
  await p.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
  return p;
}
const waitText = (p, text, ms = 45000) =>
  p.waitForFunction((t) => document.body.innerText.includes(t), { timeout: ms }, text);
const clickByText = (p, text) =>
  p.evaluate((t) => {
    const els = [...document.querySelectorAll("button, a")];
    const el = els.find((e) => e.innerText.trim().startsWith(t));
    if (!el) throw new Error(`no element with text: ${t}`);
    el.click();
  }, text);
const headerOf = (p) => p.evaluate(() => document.querySelector("header")?.innerText.replace(/\n/g, " · "));

console.log("[client] open dashboard");
const client = await newPage("http://localhost:3000/?role=client");
await waitText(client, "1000");
console.log("  header:", await headerOf(client));

console.log("[beat 1] client creates escrow (prefilled form)");
await clickByText(client, "Create escrow");
await waitText(client, "Freelancer address");
console.log("  freelancer prefilled:", await client.$eval("input", (i) => i.value));
await clickByText(client, "Create escrow");
await waitText(client, "Awaiting deposit");
console.log("  escrow page:", client.url());

console.log("[beat 2] client deposits 300 (approve + deposit, auto-signed)");
await clickByText(client, "Approve + Deposit 300");
await waitText(client, "Funds locked");
console.log("  status: Funds locked ✓");

console.log("[freelancer] open dashboard, open escrow");
const freelancer = await newPage("http://localhost:3000/?role=freelancer");
await waitText(freelancer, "Escrow");
await freelancer.evaluate(() => {
  const links = [...document.querySelectorAll("a")].filter((a) => a.href.includes("/escrow/0x"));
  if (!links.length) throw new Error("escrow link not found on freelancer dashboard");
  links[links.length - 1].click();
});
await waitText(freelancer, "Funded — awaiting work");
console.log("  freelancer sees funded milestone ✓");

console.log("[beat 3] freelancer submits milestone 1 (file hash)");
const fileInput = await freelancer.$('input[type="file"]');
await fileInput.uploadFile(DELIVERABLE);
await waitText(freelancer, "Submitted — awaiting client review");
console.log("  submitted, deliverable hash on-chain ✓");

console.log("[beat 4] client approves + releases");
// headless tabs throttle timers when hidden, freezing react-query polling —
// the real demo uses two visible windows, so bring the tab forward to mimic that
await client.bringToFront();
await waitText(client, "Approve", 30000);
await clickByText(client, "Approve");
await waitText(client, "Release payment");
await clickByText(client, "Release payment");
await waitText(client, "✓ Paid to freelancer");
console.log("  released ✓");

await freelancer.bringToFront();
await waitText(freelancer, "100");
console.log("[final] client header:    ", await headerOf(client));
console.log("[final] freelancer header:", await headerOf(freelancer));

const ok =
  (await headerOf(client)).includes("700") && (await headerOf(freelancer)).includes("100");
console.log(ok ? "\nUI E2E PASSED — all beats work in a real browser." : "\nE2E FAILED — headers wrong");
await browser.close();
process.exit(ok ? 0 : 1);
