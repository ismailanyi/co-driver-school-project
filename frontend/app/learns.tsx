import { router } from 'expo-router';
import { Text, View } from "@/components/themed";
import { layouts } from "@/constants/layouts";
import Popover from "react-native-popover-view/dist/Popover";
import { Icon } from "@/components/icons";
import { useTheme } from "@/context/theme";
import { useBreakpoint } from "@/context/breakpoints";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";
import { CourseDetailsBar } from "@/components/course-details-bar";
import { Metadata } from "@/components/metadata";
import { MobileTabsBar } from "@/components/layouts/mobile-tabs-bar";
import { courseConfig } from "@/config/course";

import { useLanguageCode } from '@/store/useLanguageStore';
import { useCourse } from '@/store/useCourseStore';
import { courseContent } from "@/content/courses/data";

const Learn = () => {
  const Lessons = [
    {id: 'theory', Label: 'Theory', description: 'Learn all Theory content', router: '/theory'},
    {id: 'signs', Label: 'Road Signs', description: 'Learn all Road Signs content', router: '/signs'},
/*     {id: 'mtb', Label: 'MTB (Model Town Board)', description: 'Practice the Model Town board', router: '/mtb'} */
  ] as const
  const breakpoint = useBreakpoint();
  const [headerHeight, setHeaderHeight] = useState(0);
  const {
    border: themeborder,
    accent,
    background,
    primary,
    primaryForeground,
    foreground,
    mutedForeground,
    muted,
  } = useTheme();

  const [popoverId, setPopoverId] = useState<string | null>(null)

  const [isVisiable, setIsVisiable] = useState(false);
  const openPopover = () => setIsVisiable(true);
  const closePopover = () => setPopoverId(null);

  const { languageCode } = useLanguageCode();
  const { courseId, courseProgress } = useCourse();

  let isOdd = true;
  let translateX = 0;

  const currentSection = courseContent.sections[courseProgress.sectionId];
  if (!currentSection) return null;


  const renderCourseChapter = () => (
    <View
      style={{
        gap: layouts.padding * 4,
        paddingHorizontal: breakpoint === "sm" ? 0 : layouts.padding * 2,
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: breakpoint === "md" ? "flex-start" : "space-between",
            padding: layouts.padding * 2,
            backgroundColor: accent,
            borderRadius: breakpoint === "sm" ? 0 : layouts.padding,
            alignItems: "center",
          },
          breakpoint === "sm" && {
            paddingHorizontal: layouts.padding,
          },
        ]}
      >
        <View
          style={{
            backgroundColor: accent,
            gap: layouts.padding,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Co-Driver
          </Text>
          <Text style={{ color: mutedForeground }}>
            Practice the 2 major aspects, the road signs and theory questions
          </Text>
        </View>
        <Button
          variant="ghost"
          viewStyle={{
            padding: layouts.padding * 0.5,
          }}
        >
          <Icon name="notebook" />
        </Button>
      </View>

      <View
        style={{
          gap: layouts.padding * 2,
          alignItems: "center",
        }}
      >
        
    
    <View>
      {Lessons.map((lesson, index) => {
        const offset = [ 100, 100, 150, 0]
        const translateX = offset[index % offset.length]
        return (
          <View
            key={lesson.id}
            style={{
              transform: [{translateX}],
              marginBottom: layouts.padding * 2
            }}
          >
            <Popover
              key={lesson.id}
              isVisible={popoverId === lesson.id}
              onRequestClose={closePopover}
              popoverStyle={{
                borderRadius: layouts.padding,
                backgroundColor: themeborder,
              }}
              backgroundStyle={{
                backgroundColor: background,
                opacity: 0.5,
              }}
              from={
                <Pressable onPress={() => {setPopoverId(lesson.id)}}>
                  <View
                    style={{
                      padding: layouts.padding / 2,
                      width: CIRCLE_RADUIS * 2,
                      aspectRatio: 1,
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: 9999,
                        backgroundColor: primary,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                        <Icon name="star" size={32} color={primaryForeground} />
                    </View>
                  </View>
                </Pressable>
              }
            >
              <View
                style={{
                  padding: layouts.padding,
                  borderRadius: layouts.padding,
                  width: 300,
                  borderWidth: layouts.borderWidth,
                  borderColor: themeborder,
                  gap: layouts.padding,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: layouts.padding,
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: foreground,
                    }}
                  >
                    {lesson.Label}
                  </Text>
                    <View
                      style={{
                        paddingVertical: layouts.padding / 2,
                        paddingHorizontal: layouts.padding,
                        borderRadius: layouts.padding / 2,
                        backgroundColor: muted,
                      }}
                    >
                      <Text
                        style={{
                          textTransform: "uppercase",
                          fontWeight: "bold",
                          color: mutedForeground,
                        }}
                      >
                        Easy
                      </Text>
                    </View>
                </View>
                <Text style={{ color: mutedForeground }}>
                  {lesson.description}
                </Text>
                <Button
                  onPress={() => {
                    closePopover();
                    router.push(lesson.router);

                  }}
                >
                    Start +10 xp
                </Button>
              </View>
            </Popover>
          </View>
        /*  <ThemedButton
            key={lesson.id}
            text={lesson.Label}
            textStyle={globalStyles.homeTextStyle}
            style={globalStyles.homeButtonsStyles}
            onPress = {() => {router.push(lesson.router)}}
          /> */
        )
      })}
    </View>
    </View>
  </View>
  )


  return (
    <>
      <Metadata
        title="Learn"
        description="Learn a new lesson every day to keep your streak."
      />
      <View style={{ flex: 1, position: "relative" }}>
        <View
          style={{
            borderBottomWidth: layouts.borderWidth,
            borderBottomColor: themeborder,
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            zIndex: 9999,
            gap: layouts.padding * 2,
          }}
          onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
        >
          {(breakpoint === "sm" || breakpoint === "md") && (
            <CourseDetailsBar
              style={{
                paddingTop:
                  breakpoint === "sm" ? layouts.padding : layouts.padding * 3,
                paddingHorizontal:
                  breakpoint === "sm" ? layouts.padding : layouts.padding * 2,
              }}
            />
          )}
          <View
            style={{
              paddingBottom: layouts.padding,
              paddingTop:
                breakpoint === "sm"
                  ? 0
                  : breakpoint === "md"
                  ? layouts.padding * 2
                  : layouts.padding * 3,
            }}
          >
            <Text>
              
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: mutedForeground,
                textAlign: "center",
              }}
            >
              Co-Driver
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingTop:
              breakpoint === "sm"
                ? headerHeight
                : headerHeight + layouts.padding * 2,
            paddingBottom: layouts.padding * 2,
            gap: layouts.padding * 4,
          }}
          showsVerticalScrollIndicator={false}
        >{
          renderCourseChapter()
        }
        </ScrollView>
      </View>
      {breakpoint === "sm" && (
        <MobileTabsBar navItems={courseConfig.mobileNavItems} />
      )}
    </>
  )
}

export default Learn;