import { ThemedText } from "@/components/themed-text";
import { StyleSheet, TouchableOpacity, type TouchableOpacityProps, type StyleProp, type TextStyle } from "react-native";
import { globalStyles } from "@/constants/globalStyles";

type ThemedButtonProps = TouchableOpacityProps & {
    title: string;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
};

export const ThemedButton = ({ 
    title, 
    loading, 
    style, 
    textStyle,
    ...otherprops
    }: ThemedButtonProps) => {
    const isDisabled = loading || otherprops.disabled;
    return (
        <TouchableOpacity 
            style={[globalStyles.button, isDisabled && globalStyles.disabled,style]} 
            disabled={loading || otherprops.disabled}
            {...otherprops}
        >
            <ThemedText type="defaultSemiBold" style={[globalStyles.text, textStyle]}>
                {title}
            </ThemedText>

            </TouchableOpacity>
    )
}
