import { defineConfig } from "vite";

// GitHub Pages(https://<user>.github.io/<repo>/)에서도 경로가 깨지지 않도록 상대 경로로 빌드
export default defineConfig({
  base: "./",
});
