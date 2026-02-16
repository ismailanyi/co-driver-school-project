import { TextInput, type TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from "@react-navigation/native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
}

export function ThemedTextInput({style, lightColor, darkColor, ...otherProps}: ThemedTextInputProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor}, "text")
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor}, "icon")
    const placeholderColor = useThemeColor({ light: lightColor, dark: darkColor}, "tabIconDefault")

    return <TextInput 
        style={[styles.default, {color: textColor, borderColor: borderColor}, style]}
        placeholderTextColor={placeholderColor}
        {...otherProps}
    />
}


const styles = StyleSheet.create({
    default: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
    }
})