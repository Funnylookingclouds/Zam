import React from "react";
import { Composition, Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";
import { AgentyCard } from "./mascots/AgentyCard";
import { MeetGang, MEET_FRAMES, FPS } from "./MeetGang";
import { Wild01, WILD01_FRAMES } from "./episodes/wild01";
import { Wild02, WILD02_FRAMES } from "./episodes/wild02";
import { Wild03, WILD03_FRAMES } from "./episodes/wild03";
import { PuckyDay, PUCKYDAY_FRAMES } from "./episodes/pucky_day";
import { PuckyDayToon, TOON_FRAMES } from "./episodes/pucky_day_toon";
import { BiscuitDay, BISCUITDAY_FRAMES } from "./episodes/biscuit_day_toon";
import { ClubbyDay, CLUBBYDAY_FRAMES } from "./episodes/clubby_day_toon";
import { ZamNight, ZAMNIGHT_FRAMES } from "./episodes/zam_night_toon";
import { HelmyLab, HELMYLAB_FRAMES } from "./episodes/helmy_lab_toon";
import { AgentyTop5, AGENTYTOP5_FRAMES } from "./episodes/agenty_top5_toon";

export const Root: React.FC = () => (
  <>
    <Composition id="MeetGang" component={MeetGang} durationInFrames={MEET_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild01" component={Wild01} durationInFrames={WILD01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild02" component={Wild02} durationInFrames={WILD02_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="PuckyDay" component={PuckyDay} durationInFrames={PUCKYDAY_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="PuckyDayToon" component={PuckyDayToon} durationInFrames={TOON_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="BiscuitDay" component={BiscuitDay} durationInFrames={BISCUITDAY_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="ClubbyDay" component={ClubbyDay} durationInFrames={CLUBBYDAY_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="ZamNight" component={ZamNight} durationInFrames={ZAMNIGHT_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="HelmyLab" component={HelmyLab} durationInFrames={HELMYLAB_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild03" component={Wild03} durationInFrames={WILD03_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="AgentyTop5" component={AgentyTop5} durationInFrames={AGENTYTOP5_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="AgentyCard" component={AgentyCard} width={1080} height={1920} />
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
