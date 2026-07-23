# spreadsheet-formula-tools

Axiom marketplace package (`christiangeorgelucas/spreadsheet-formula-tools`) for parsing and
evaluating Excel/Google-Sheets-style formulas — SUM, VLOOKUP, IF, date/text/statistical
functions, and financial functions (PMT, FV, NPV, IRR, RATE, and more) — against a
caller-supplied cell context, returning the computed value.

Built for the Axiom marketplace: every node is a pure, stateless, deterministic
single-input → single-output transform. No network, filesystem, or persisted workbook
state — every cell value a formula needs is supplied directly in the request.

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/spreadsheet-formula-tools@0.1.0

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/spreadsheet-formula-tools/Evaluate --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/spreadsheet-formula-tools/0.1.0/Evaluate \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/spreadsheet-formula-tools/Evaluate`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

## What it wraps

- [fast-formula-parser](https://github.com/LesterLyu/fast-formula-parser) (MIT) — Excel-grammar
  parsing (LL(1), built on [Chevrotain](https://chevrotain.io), Apache-2.0) and ~280 built-in
  Excel-compatible functions (math, statistical, text, date/time, lookup, logical, engineering,
  information).
- [@formulajs/formulajs](https://github.com/formulajs/formulajs) (MIT) — bridged in for Excel's
  financial-function family (PMT, FV, PV, NPV, IRR, RATE, NPER, IPMT, PPMT, CUMIPMT, CUMPRINC,
  SLN, SYD, DB, DDB, XIRR, XNPV, MIRR, FVSCHEDULE, ISPMT, DOLLARDE, DOLLARFR, EFFECT, NOMINAL,
  PDURATION, RRI), none of which fast-formula-parser implements natively.

**Note:** [HyperFormula](https://github.com/handsontable/hyperformula) — the most feature-complete
spreadsheet engine in the JS ecosystem — was deliberately NOT used. It is dual-licensed
GPLv3/commercial, incompatible with this marketplace's permissive-license requirement.

## Nodes

- **Evaluate** — evaluate one formula against a cell context, returning a scalar, array, or
  Excel error-value result.
- **EvaluateBatch** — evaluate up to 500 formulas against the same shared cell context in one call.
- **ValidateFormula** — check formula syntax without a cell context.
- **ExtractReferences** — list the cells/ranges a formula reads and the functions it calls,
  without evaluating it.
- **ListSupportedFunctions** — the full supported-function catalog with categories.
- **FormatValue** — render a value under an Excel number-format code (e.g. `"#,##0.00"`,
  `"yyyy-mm-dd"`, `"0.00%"`).
- **ConvertCellReference** — convert between A1-notation text and 0-based row/col indices.

Cell addressing (`CellValue`'s `row`/`col`/`type`/`string_value`/`number_value`/`bool_value`
fields) deliberately mirrors `christiangeorgelucas/office-tools`' `Cell` message, so a `GridResult`
read from a real workbook can feed directly into a formula's context.

## License

MIT — see [LICENSE](./LICENSE).
