# Logish Changelog

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