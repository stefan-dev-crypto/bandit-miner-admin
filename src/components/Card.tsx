import * as React from "react";

type Theme = {
  background: string;
  titleColor: string;
  valueColor: string;
  descriptionColor: string;
};

type CardProps = {
  title: string;
  value: string | number;
  symbol: string;
  description: string;
  theme?: Theme;
};

export function Card({
  title,
  value,
  symbol,
  description,
  theme = {
    background: "rgb(0, 255, 244)",
    titleColor: "rgb(0, 56, 55)",
    valueColor: "rgb(0, 56, 55)",
    descriptionColor: "rgb(0, 119, 117)",
  },
}: CardProps): JSX.Element {
  return (
    <div>
      <div
        className="h-40 rounded-xl shadow-md p-6"
        style={{ background: theme.background }}
      >
        <div
          className="font-semibold mb-1 text-lg"
          style={{ color: theme.titleColor }}
        >
          {title}
        </div>
        <div
          className="font-semibold text-5xl tracking-tight"
          style={{ color: theme.valueColor }}
        >
          {value} {symbol}
        </div>
        <div className="font-normal" style={{ color: theme.descriptionColor }}>
          {description}
        </div>
      </div>
    </div>
  );
}
