import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 로컬 개발 환경 설정 (Docker로 실행 시 설정해줘야함)
  server: {
    port: 5173, // 포트 번호
    host: true, // 모든 네트워크 인터페이스에서 접근 가능
                    // Docker 환경에서 실행 하더라도 접근은 로컬에서 도커 컨테이너로 진행되기 때문에 필요
                    // host는 Docker 컨테이너이지 localhost가 아니기 때문
    strictPort: true, // 포트가 이미 사용 중이라면 오류 발생
    watch: {
      usePolling: true, // Docker 환경에서 실행 되더라도 코드 변경시 핫 리로드를 위해 사용
    }
  }
});
