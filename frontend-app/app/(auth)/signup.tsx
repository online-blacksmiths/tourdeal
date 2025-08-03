import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { FormInput } from "@/widgets/FormInput/ui";

export default function Signup() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  return (
    <View className="flex-1 gap-2 bg-white px-8 pt-32">
      <View className="w-full flex-1 gap-8">
        <Text className="text-3xl font-bold color-primary-500">회원가입</Text>
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <FormInput
              label="아이디"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "아이디를 입력해 주세요",
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <FormInput
              label="이메일"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "이메일 주소를 입력해 주세요",
                  keyboardType: "email-address",
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <FormInput
              label="비밀번호"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              helperText="8~20자 영문, 숫자, 특수문자를 조합해 주세요"
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "비밀번호를 입력해 주세요",
                  keyboardType: "default",
                  secureTextEntry: true,
                },
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="passwordConfirm"
          render={({ field, fieldState }) => (
            <FormInput
              label="비밀번호확인"
              size="sm"
              isInvalid={!!fieldState.error}
              error={fieldState.error?.message}
              slotProps={{
                input: {
                  value: field.value,
                  onChangeText: field.onChange,
                  placeholder: "비밀번호를 다시한번 입력해 주세요",
                  keyboardType: "default",
                  secureTextEntry: true,
                },
              }}
            />
          )}
        />
        <Button>
          <ButtonText>회원가입</ButtonText>
        </Button>
      </View>
    </View>
  );
}
