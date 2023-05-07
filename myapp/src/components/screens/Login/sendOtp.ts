import { useMutation } from "@apollo/client";
import { sendOtpMutation } from "../../../graphql/mutation/user/sendOtp";
import { useAuth } from "../../../../context/auth";
import { useRouter } from "expo-router";

export async function useSendOtp(phoneNumber: string) {
  const router = useRouter();
  const { token, setPhoneNumber } = useAuth();

  const [sendOtpMutate] = useMutation(sendOtpMutation);

  const response = await sendOtpMutate({
    variables: {
      input: { to: phoneNumber },
    },
  });

  if (response?.data?.sendOtp?.ok) {
    setPhoneNumber(phoneNumber);
    router.push("/verifyOtp");
  }
}
