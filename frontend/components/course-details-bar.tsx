import { Icon } from "@/components/icons";
import { Text, View, ViewProps } from "@/components/themed";
import { layouts } from "@/constants/layouts";

import { SelectCourse } from "./select-course";

interface Props extends ViewProps {
}
export function CourseDetailsBar({ style, ...props }: Props) {
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Icon name="fire" />
        <Text style={{ fontWeight: "800" }}>356</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Icon name="donut" />
        <Text style={{ fontWeight: "800" }}>500</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layouts.padding * 0.5,
        }}
      >
        <Icon name="heart" />
        <Text style={{ fontWeight: "800" }}>5</Text>
      </View>
    </View>
  );
}
