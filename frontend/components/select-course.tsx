import { useState } from "react";
import { Pressable } from "react-native";
import Popover from "react-native-popover-view/dist/Popover";
import { Placement } from "react-native-popover-view/dist/Types";
import { Text, View } from "@/components/themed";
import { getLanguage, languages } from "@/config/language";
import { layouts } from "@/constants/layouts";
import { useCourse } from "@/store/useCourseStore";
import { useTheme } from "@/context/theme";
import { SupportedLanguageCode } from "@/types";

interface Props {
  excludes?: SupportedLanguageCode[];
}

export function SelectCourse({ excludes }: Props) {
  const Lessons = [
    {id: 'theory', Label: 'Theory', description: 'Learn all Theory content', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', description: 'Learn all Road Signs content', router: '/signs'},
/*     {id: 'mtb', Label: 'MTB (Model Town Board)', description: 'Practice the Model Town board', router: '/mtb'} */
  ] as const
  const { border, accent, background, mutedForeground } = useTheme();
  const [isVisiable, setIsVisiable] = useState(false);
  const { courseId, setCourseId } = useCourse();
  
  if (!courseId) return null;

  const CourseFlagIcon = getLanguage(courseId).flag

  return (
    <Popover
      placement={Placement.BOTTOM}
      isVisible={isVisiable}
      onRequestClose={() => setIsVisiable(false)}
      popoverStyle={{
        borderRadius: layouts.padding,
        backgroundColor: border,
      }}
      backgroundStyle={{
        backgroundColor: background,
        opacity: 0.5,
      }}
      from={
        <Pressable
          style={{
            flexDirection: "row",
            gap: 6,
            alignItems: "center",
          }}
          onPress={() => setIsVisiable(!isVisiable)}
        >
          <View
            style={{
              height: 28,
              aspectRatio: 4 / 3,
              overflow: "hidden",
            }}
          >
            <CourseFlagIcon
              size={24}
              color={'#000000'}
            />
          </View>
        </Pressable>
      }
    >
      <View
        style={{
          borderWidth: layouts.borderWidth,
          borderRadius: layouts.padding,
          borderColor: border,
          overflow: "hidden",
          minWidth: 300,
        }}
      >
        <View
          style={{
            padding: layouts.padding,
            borderBottomWidth: layouts.borderWidth,
            borderBottomColor: border,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: mutedForeground,
              textAlign: "center",
            }}
          >
            Select Course
          </Text>
        </View>
        {Object.keys(languages).map((key, index) => {
          const code = key as SupportedLanguageCode;
          const language = languages[code];
          const FlagIcon = language.flag;

          if (excludes?.includes(code)) {
            return null;
          }

          return (
            <Pressable
              key={index}
              onPress={() => {
                setIsVisiable(false);
                setCourseId(code);
              }}
            >
              {({ hovered, pressed }) => (
                <View
                  style={{
                    padding: layouts.padding,
                    flexDirection: "row",
                    gap: layouts.padding,
                    alignItems: "center",
                    backgroundColor: hovered || pressed ? accent : background,
                  }}
                >
                  <View
                    style={{
                      height: 28,
                      aspectRatio: 4 / 3,
                      overflow: "hidden",
                    }}
                  >
                    <FlagIcon
                      size={24}
                      color={'#000000'}
                    />
                  </View>
                  <Text>{language.name}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </Popover>
  );
}
