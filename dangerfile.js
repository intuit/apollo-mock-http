import commitlint from 'danger-plugin-conventional-commitlint'
import configConventional from '@commitlint/config-conventional';

(async function dangerReport() {

  const commitlintConfig = {
    severity: 'fail'
  };
  await commitlint(configConventional.rules, commitlintConfig);
})();