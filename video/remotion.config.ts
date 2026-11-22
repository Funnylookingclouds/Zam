import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setConcurrency(4);
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell");
Config.setChromiumOpenGlRenderer("swangle");
