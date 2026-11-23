import React from "react";
import { Composition, Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";
import { AgentyCard } from "./mascots/AgentyCard";
import { ChannelAvatarA, ChannelAvatarB, ChannelBanner } from "./brand/Channel";
import { IconWildest, IconDailyFacts, IconSpecial } from "./brand/SeriesIcons";
import { MeetGang, MEET_FRAMES, FPS } from "./MeetGang";
import { Wild01, WILD01_FRAMES } from "./episodes/wild01";
import { Wild02, WILD02_FRAMES } from "./episodes/wild02";
import { Wild03, WILD03_FRAMES } from "./episodes/wild03";
import { Wild04, WILD04_FRAMES } from "./episodes/wild04";
import { PuckyDay, PUCKYDAY_FRAMES } from "./episodes/pucky_day";
import { PuckyDayToon, TOON_FRAMES } from "./episodes/pucky_day_toon";
import { BiscuitDay, BISCUITDAY_FRAMES } from "./episodes/biscuit_day_toon";
import { ClubbyDay, CLUBBYDAY_FRAMES } from "./episodes/clubby_day_toon";
import { ZamNight, ZAMNIGHT_FRAMES } from "./episodes/zam_night_toon";
import { HelmyLab, HELMYLAB_FRAMES } from "./episodes/helmy_lab_toon";
import { AgentyTop5, AGENTYTOP5_FRAMES } from "./episodes/agenty_top5_toon";
import { ProspectWatch01, PROSPECTWATCH01_FRAMES } from "./episodes/prospect_watch_01_toon";
import { SummerCamp, SUMMERCAMP_FRAMES } from "./episodes/summer_camp_toon";
import { SnowballFight, SNOWBALL_FRAMES } from "./episodes/snowball_toon";

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
    <Composition id="ProspectWatch01" component={ProspectWatch01} durationInFrames={PROSPECTWATCH01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="SummerCamp" component={SummerCamp} durationInFrames={SUMMERCAMP_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="ChannelAvatarA" component={ChannelAvatarA} durationInFrames={60} fps={FPS} width={800} height={800} />
    <Composition id="ChannelAvatarB" component={ChannelAvatarB} durationInFrames={60} fps={FPS} width={800} height={800} />
    <Composition id="ChannelBanner" component={ChannelBanner} durationInFrames={60} fps={FPS} width={2560} height={1440} />
    <Composition id="ChannelBannerGuides" component={() => <ChannelBanner guides />} durationInFrames={60} fps={FPS} width={2560} height={1440} />
    <Composition id="Wild04" component={Wild04} durationInFrames={WILD04_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="IconWildest" component={IconWildest} width={1080} height={1080} />
    <Still id="IconDailyFacts" component={IconDailyFacts} width={1080} height={1080} />
    <Still id="IconSpecial" component={IconSpecial} width={1080} height={1080} />
    <Composition id="SnowballFight" component={SnowballFight} durationInFrames={SNOWBALL_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="AgentyCard" component={AgentyCard} width={1080} height={1920} />
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
