import React from "react";
import { Composition, Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";
import { MeetGang, MEET_FRAMES, FPS } from "./MeetGang";
import { Wild01, WILD01_FRAMES } from "./episodes/wild01";

export const Root: React.FC = () => (
  <>
    <Composition id="MeetGang" component={MeetGang} durationInFrames={MEET_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild01" component={Wild01} durationInFrames={WILD01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
