import { Icon } from "@/components/icons";
import { Text, View, ViewProps } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import { SelectCourse } from "./select-course";
import { Zap } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "@/context/theme";

interface Props extends ViewProps {
}
export function CourseDetailsBar({ style, ...props }: Props) {
  const { user } = useAuthStore();
  const { foreground } = useTheme();

  return (
    <View
      style={[
        {
          flexDirection: "row",
          justifyContent: "space-between",
          gap: layouts.padding * 2,
        },
        style,
      ]}
      {...props}
    >
      <SelectCourse />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Icon name="fire" color="#ff9600" />
        <Text style={{ fontWeight: "800", color: "#ff9600" }}>{user?.streak_count || 0}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Zap color="#1cb0f6" fill="#1cb0f6" size={24} />
        <Text style={{ fontWeight: "800", color: "#1cb0f6" }}>{user?.total_xp || 0}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Icon name="heart" color="#ff4b4b" />
        <Text style={{ fontWeight: "800", fontSize: 18, color: "#ff4b4b" }}>
          {user?.school_code ? "∞" : user?.hearts ?? 5}
        </Text>
      </View>
    </View>
  );
}
