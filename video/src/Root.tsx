import React from "react";
import { Still } from "remotion";
import { HockeyMascots } from "./mascots/Sketch";

export const Root: React.FC = () => (
  <>
    <Still id="ZamGang" component={HockeyMascots} width={1080} height={1240} />
  </>
);
