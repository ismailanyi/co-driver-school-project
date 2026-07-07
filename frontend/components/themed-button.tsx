import { ThemedText } from "@/components/themed-text";
import { TouchableOpacity, type TouchableOpacityProps, type StyleProp, type TextStyle } from "react-native";
import { globalStyles } from "@/constants/globalStyles";
import { PropsWithChildren } from "react";

type ThemedButtonProps = PropsWithChildren<TouchableOpacityProps & {
    text?: string;
    loading?: boolean;
    textStyle?: StyleProp<TextStyle>;
    onPress?: () => void;
}>;

export const ThemedButton = ({
    text,
    loading,
    style,
    textStyle,
    onPress,
    children,
    ...otherprops
    }: ThemedButtonProps) => {
    const isDisabled = loading || otherprops.disabled;
    return (
        <TouchableOpacity
            style={[globalStyles.button, isDisabled && globalStyles.disabledButton,style]}
            disabled={loading || otherprops.disabled}
            {...otherprops}
            onPress={onPress}
        >
            {text && (
                <ThemedText type="defaultSemiBold" style={[globalStyles.text, textStyle]}>
                    {text}
                </ThemedText>

            )}
            {children}
        </TouchableOpacity>
    )
}
