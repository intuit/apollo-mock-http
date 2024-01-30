module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [
        2,
        'always',
        ['feat', 'fix', 'chore', 'refactor', 'style', 'test', 'perf', 'ci', 'build', 'docs'],
      ],
    },
  };