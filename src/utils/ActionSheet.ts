import { Platform, ActionSheetIOS } from 'react-native';

interface ActionSheetOptions {
  options: string[];
  cancelButtonIndex?: number;
  destructiveButtonIndex?: number;
  title?: string;
  message?: string;
}

export const showActionSheet = (
  options: ActionSheetOptions,
  callback: (buttonIndex: number) => void
) => {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(options, callback);
  } else if (Platform.OS === 'web') {
    // Web implementation
    const result = window.prompt(
      `${options.title ? options.title + '\n' : ''}${
        options.message ? options.message + '\n' : ''
      }${options.options.map((opt, i) => `${i}. ${opt}`).join('\n')}`,
      '0'
    );
    
    const selectedIndex = result ? parseInt(result, 10) : options.cancelButtonIndex || 0;
    if (selectedIndex >= 0 && selectedIndex < options.options.length) {
      callback(selectedIndex);
    } else {
      callback(options.cancelButtonIndex || 0);
    }
  } else {
    // Default to first non-cancel option for other platforms
    const nonCancelIndex = options.cancelButtonIndex === 0 ? 1 : 0;
    callback(nonCancelIndex);
  }
}; 