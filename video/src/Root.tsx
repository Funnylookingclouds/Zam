import React from "react";
import { Composition, Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";
import { MeetGang, MEET_FRAMES, FPS } from "./MeetGang";
import { Wild01, WILD01_FRAMES } from "./episodes/wild01";
import { Wild02, WILD02_FRAMES } from "./episodes/wild02";
import { PuckyDay, PUCKYDAY_FRAMES } from "./episodes/pucky_day";
import { PuckyDayToon, TOON_FRAMES } from "./episodes/pucky_day_toon";

export const Root: React.FC = () => (
  <>
    <Composition id="MeetGang" component={MeetGang} durationInFrames={MEET_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild01" component={Wild01} durationInFrames={WILD01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild02" component={Wild02} durationInFrames={WILD02_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="PuckyDay" component={PuckyDay} durationInFrames={PUCKYDAY_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="PuckyDayToon" component={PuckyDayToon} durationInFrames={TOON_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
