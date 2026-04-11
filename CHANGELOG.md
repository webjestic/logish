# Logish Changelog

## v1.1.0
- fix: `dataIndex += dataIndex` corrected to `dataIndex += 1` — multiple data objects now store at sequential indexes
- fix: file controller else branch was assigning `undefined` instead of default scheme value for `active` flag
- fix: loose equality `!=` corrected to `!==` in file controller validation (3 occurrences)
- fix: typo in `setConfig()` error message ("a  alid" → "a valid")
- fix: typo in `Controller` JSDoc comment ("Coniguration" → "Configuration")
- fix: duplicate test name in `get-set-level-test.js`
- fix: `console.log` left in `config-basic-test.js` removed
- fix: `getStats()` corrected to `showStats()` in README public methods list
- chore: removed `async` from `#addController` — method contains no async operations
- chore: replaced legacy `arguments` object with `args` rest parameter in `entry()`
- chore: file I/O catch blocks changed from `console.log` to `console.error`
- chore: default scheme mutation in file controller fixed using `structuredClone()`
- chore: `useColor` default changed to `false` — prevents ANSI codes in aggregated log output
- chore: `util.inspect` color argument now respects `useColor` setting instead of hardcoded `true`
- chore: all commented-out dead code removed across `logish.js`, `control_handler.js`, `config.js`, `control_file.js`
- chore: `engines.node` updated to `>=18.0.0`
- chore: `eslint` updated to `^8.57.0`
- chore: `npm audit fix` run — resolved 11 of 23 advisories (remaining are transitive in `tap` dev dependency)
- test: `get-set-config.js` rewritten — was a copy of namespace test, now correctly tests `setConfig()`
- test: added `entry-data-test.js` — data object handling and regression coverage for dataIndex fix
- test: added `show-stats-test.js` — return shape and entry count assertions
- test: added `file-controller-test.js` — smoke tests for file creation, writeLevels, and inactive flag
- test: added `use()` invalid argument coverage to `use-function-test.js`
- test: added `setLevel()` invalid value coverage to `get-set-level-test.js`
- ci: GitHub Actions updated — `checkout@v4`, `setup-node@v4`, `codeql-action/*@v3`
- ci: Node test matrix updated to `[18.x, 20.x]`
- ci: push trigger re-enabled on `main` in both workflows
- ci: `npm audit` now fails build at `--audit-level=high`
- ci: CodeQL scheduled scans re-enabled
- docs: README intro rewritten for clarity
- docs: added Production Recommendation section — file controller is dev-only
- docs: added Dynamic Log Level Control section — MongoDB change stream pattern for live level changes without pod restart

## v1.0.9
- [chore: removed singleton pattern from ControlHandler]()
- [feature: getConfig() successfully implemented]()
- [ci: added eslint run to node-audit]()
- [chore: eslint enhancement and enforcement updates]()
## v1.0.8
- [refactor: removed vitest and added tap for testing.](https://github.com/webjestic/logish/pull/51)
- [tests: implemented getLevel() and setLevel()](https://github.com/webjestic/logish/pull/54)
### v1.0.7
- [docs: updates to README.md](https://github.com/webjestic/logish/pull/28)
- [ci: added CodeQL workflow.](https://github.com/webjestic/logish/pull/29)
- [ci: adding node-audit to workflows](https://github.com/webjestic/logish/pull/38)
- [ci: Adding npm-publish automation](https://github.com/webjestic/logish/pull/33)
- [chore: node requirement updates](https://github.com/webjestic/logish/pull/31)
### v1.0.6
- [fix: console writing showStats to console without option](https://github.com/webjestic/logish/pull/26)
### v1.0.5
- [feat: showStats() now returns array of objects](https://github.com/webjestic/logish/pull/22)
### v1.0.4
- [fix: Removed 'message requirement' from logEntry.](https://github.com/webjestic/logish/pull/19)

### Changelog Entry Types

- fix: PR reflects a bug fix (including inline spelling corrections).
- feature: RP reflects a new feature
- chore: PR reflects a chore (such as package version increment, code cleaning, or doc cleaening)
- refactor: PR reflects a better implementation, which coes not change functional outcome
- type: PR reflects an actual `type` change (such as class to interface)
- ci: PR is a foundational devops (continious intergration) change
- docs: PR reflects documentation updatesd
- test: PR reflects test enhancements, which may be fixes or features