module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./test/setup.ts"],
  transform: {
    "^.+\\.tsx?$": [ "ts-jest", { tsconfig: { jsx: "react-jsx" }}],
  },
};