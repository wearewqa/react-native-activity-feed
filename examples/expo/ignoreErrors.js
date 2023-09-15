import { LogBox } from 'react-native';

if (__DEV__) {
  const ignoreErrors = ['ViewPropTypes will be removed from React Native'];

  const error = console.error;
  console.error = (...arg) => {
    for (const error of ignoreErrors) {
      if (arg[0].startsWith(error)) {
        return;
      }
    }
    error(...arg);
  };

  LogBox.ignoreLogs(ignoreErrors);
}
