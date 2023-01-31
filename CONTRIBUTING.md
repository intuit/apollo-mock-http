## Contributing

We do not allow contributors to claim issues. If you find something interesting you can contribute to the repo, feel free to raise a PR.

1. Fork the repo
1. Install dependencies by executing `yarn`
1. Make your changes locally and test them as per guidelines below
1. Ensure the code coverage is the same or higher than before your changes
1. Create a PR to the `master` branch


## Working locally (for collaborators)

This uses yarn. So, once you clone the repo, run `yarn install` to install the dependencies.

Go to this project folder in your machine and run this, to generate a local ref to this library
```bash
yarn link
```

Now link the plugin / your app's dependency to the generated ref above
```
yarn link apollo-mock-http
```

Once you work on the utilities or methods in this library code, ensure you run `yarn build` to build the contents. And then you can refresh your app's contents to see the update reflected into your app.

To run unit tests
```
yarn test
```

To run test with coverages
```
yarn test --collect-coverage
```

To debug while unit testing (by modifying jest path accordingly)
```
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand
```

