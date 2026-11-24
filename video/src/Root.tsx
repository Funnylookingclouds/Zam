import React from "react";
import { Composition, Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";
import { AgentyCard } from "./mascots/AgentyCard";
import { HockeyLifeCast, HockeyLifeFrame } from "./mascots/HockeyLifeCard";
import { Proto25DLow, Proto25DOTS, Proto25DWide } from "./hl3d/Proto25D";
import { GangCard2, GangScene2 } from "./mascots/GangCard2";
import { HockeyLife01, HL01_FRAMES } from "./episodes/hockey_life_01";
import { HockeyLifeRef, HLREF_FRAMES } from "./episodes/hockey_life_ref";
import { Wild05HL, WILD05_FRAMES } from "./episodes/wild05_hl";
import { Wild06HL, WILD06_FRAMES } from "./episodes/wild06_hl";
import { HockeyLife01_25D, HL01_25D_FRAMES } from "./episodes/hockey_life_01_25d";
import { HockeyLifePhoto, PHOTO_FRAMES } from "./episodes/hockey_life_photo";
import { HockeyLifeMascot, MASCOT_FRAMES } from "./episodes/hockey_life_mascot";
import { BabyCard } from "./mascots/BabyCard";
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
import { Child01, CHILD01_FRAMES } from "./episodes/child01_toon";
import { Child02, CHILD02_FRAMES } from "./episodes/child02_toon";
import { Child03Long, CHILD03_FRAMES, FPS30 } from "./episodes/child03_long";

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
    <Composition id="Child01" component={Child01} durationInFrames={CHILD01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Child02" component={Child02} durationInFrames={CHILD02_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Child03Long" component={Child03Long} durationInFrames={CHILD03_FRAMES} fps={FPS30} width={1920} height={1080} />
    <Still id="BabyCard" component={BabyCard} width={1080} height={1920} />
    <Still id="AgentyCard" component={AgentyCard} width={1080} height={1920} />
    <Composition id="HockeyLife01" component={HockeyLife01} durationInFrames={HL01_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="HockeyLifeRef" component={HockeyLifeRef} durationInFrames={HLREF_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild05HL" component={Wild05HL} durationInFrames={WILD05_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="Wild06HL" component={Wild06HL} durationInFrames={WILD06_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="Proto25DWide" component={Proto25DWide} width={1080} height={1920} />
    <Still id="Proto25DOTS" component={Proto25DOTS} width={1080} height={1920} />
    <Still id="Proto25DLow" component={Proto25DLow} width={1080} height={1920} />
    <Composition id="HockeyLife01-25D" component={HockeyLife01_25D} durationInFrames={HL01_25D_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="HockeyLifePhoto" component={HockeyLifePhoto} durationInFrames={PHOTO_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="GangCard2" component={GangCard2} width={1080} height={1920} />
    <Still id="GangScene2" component={GangScene2} width={1080} height={1920} />
    <Composition id="HockeyLifeMascot" component={HockeyLifeMascot} durationInFrames={MASCOT_FRAMES} fps={FPS} width={1080} height={1920} />
    <Still id="HockeyLifeCast" component={HockeyLifeCast} width={1080} height={1920} />
    <Still id="HockeyLifeFrame" component={HockeyLifeFrame} width={1080} height={1920} />
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
