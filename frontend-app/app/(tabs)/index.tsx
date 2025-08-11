import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { FormLabel } from "@/widgets/FormLabel/ui";

export default function Home() {
  return (
    <KeyboardAwareScrollView className="flex-1 bg-white" enableOnAndroid={true}>
      <View className="px-8 pt-32">
        <View className="flex-1 gap-8">
          <Text className="text-4xl font-bold color-primary-500">
            견적 신청서
          </Text>
          <View className="flex gap-2">
            <FormLabel title="일정은 어떻게 되나요?" required />
            <View className="flex-row gap-2">
              <View className="flex-1 flex-row items-end gap-2">
                <Input className="flex-1">
                  <InputField keyboardType="numeric" />
                </Input>
                <Text className="text-xs color-typography-500">박</Text>
              </View>
              <View className="flex-1 flex-row items-end gap-2">
                <Input className="flex-1">
                  <InputField keyboardType="numeric" />
                </Input>
                <Text className="text-xs color-typography-500">일</Text>
              </View>
            </View>
          </View>
          <View className="gap-2">
            <FormLabel title="예산은 어느정도를 생각하시나요?" required />
            <View className="flex-row items-end gap-2">
              <Input className="flex-1">
                <InputField placeholder="예산을 입력해 주세요" />
              </Input>
              <Text className="text-xs color-typography-500">원</Text>
            </View>
          </View>
          <View className="gap-2">
            <FormLabel title="목먹지는 어디인가요?" required />
            <View className="flex-row">
              <Input className="flex-1">
                <InputField placeholder="여행 목먹지를 입력해 주세요" />
              </Input>
            </View>
          </View>
          <View className="gap-2">
            <FormLabel title="선호하는 리조트가 있나요?" />
            <View className="flex-row">
              <Input className="flex-1">
                <InputField placeholder="리조트를 입력해 주세요" />
              </Input>
            </View>
          </View>
          <View className="gap-2">
            <FormLabel title="더 궁금한 것이 있나요?" />
            <View className="flex-row">
              <Textarea className="h-24 flex-1">
                <TextareaInput placeholder="문의 사항을 입력해 주세요" />
              </Textarea>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
