import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { globalStyles } from '@/constants/globalStyles';
import { PropsWithChildren } from 'react';

export type ThemedViewProps = ViewProps & PropsWithChildren<{
  lightColor?: string;
  darkColor?: string;
}>;

export const ThemedView = ({ 
  style, 
  lightColor, 
  darkColor, 
  children,
  ...otherProps }: ThemedViewProps) => {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <View style={[globalStyles.container, { backgroundColor }, style]} {...otherProps}>
      {children}
    </View>
    );
}
