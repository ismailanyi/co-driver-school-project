import QuestionScreen from "@/components/question-screen"
import { Image } from "expo-image";
import { globalStyles } from "@/constants/globalStyles";

/* interface Sign {
  id: number;
  name: string;
  category: string;
  image_url: string;
}
 */
const Sign = () => {
    
    return (
        <QuestionScreen
            question_type="sign"
            renderItem={(question) => (
                <Image
                    source={{ uri: question.image_url }}
                    style={globalStyles.signImageSize}
                    contentFit="contain"
                  />
            )}
        />
    )
}

export default Sign