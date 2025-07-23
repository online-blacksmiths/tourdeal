import type { PropsWithChildren } from "react";

export default function AuthGuard({ children }: PropsWithChildren) {
  // TODO: 이곳에서 Auth 토큰 검증 로직 추가
  return children;
}
