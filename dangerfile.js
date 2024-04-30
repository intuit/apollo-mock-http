const { danger, warn, fail } = require('danger');
const { uniq } = require('lodash');
const fs = require('fs');
const path = require('path');
const { danger, warn } = require("danger");

// Setup
const pr = danger.github.pr;
const bodyAndTitle = (pr.body + pr.title).toLowerCase();

// Custom modifiers for people submitting PRs to be able to say "skip this"
const skipTests = bodyAndTitle.includes('skip new tests');

// Check for description
if (danger.github.pr.body.length < 10) {
  warn('This pull request needs a description.');
}

// Warn when there is a big PR
const bigPRThreshold = 2000;
if (pr.additions + pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR');
}

// Gather changes
const modifiedFiles = danger.git.modified_files.filter(path =>
  path.endsWith('js')
);

// Check for console.log statements
modifiedFiles.forEach(file => {
  const content = fs.readFileSync(file).toString();
  if (content.includes('console.log') || content.includes('console.warn')) {
    fail(`a \`console.log\` was left in file (${file})`);
  }
});

// Check that every file touched has a corresponding test file
const correspondingTestsForModifiedFiles = modifiedFiles.map(f => {
  const newPath = path.dirname(f);
  const name = path.basename(f);
  return `${newPath}/__tests__/${name}`;
});

const testFilesThatDontExist = correspondingTestsForModifiedFiles
  .filter(f => !f.includes('__stories__')) // skip stories
  .filter(f => !fs.existsSync(f));

if (testFilesThatDontExist.length > 0 && !skipTests) {
  const output = `Missing Test Files:
${testFilesThatDontExist.map(f => `- \`${f}\``).join('\n')}
If these files are supposed to not exist, please update your PR body to include "Skip New Tests".`;
  warn(output);
}

const allowedPrefixes = [
  'feat',
  'fix',
  'chore',
  'chore(deps)',
  'refactor',
  'style',
  'test',
  'perf',
  'ci',
  'build',
  'docs',
];

// Check if the PR title starts with an allowed prefix
const prTitle = danger.github.pr.title;
console.log(danger.github.pr.title)
const prTitlePrefix = prTitle.split(":")[0].trimEnd().toLowerCase();

if (!allowedPrefixes.includes(prTitlePrefix)) {
  fail(`Please start the PR title with one of the following prefixes: ${allowedPrefixes.join(", ")}.`);
}
