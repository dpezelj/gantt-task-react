const chipColors: ChipColors = {
  blue: {
    text: "#518EE0",
    background: "#DAF0FB",
  },
  yellow: {
    text: "#987901",
    background: "#FEEBA3",
  },
  green: {
    text: "#2D862D",
    background: "#ADE3AC",
  },
  red: {
    text: "#f06",
    background: "#FEA3C8",
  },
  purple: {
    text: "#306",
    background: "#B770FE",
  },
  brown: {
    text: "#930",
    background: "#FE9A70",
  },
  rose: {
    text: "#c3c",
    background: "#EBADEB",
  },
  kaki: {
    text: "#E78336",
    background: "#FCEFD4",
  },
  orange: {
    text: "#a13b08",
    background: "#fb9b72",
  },
};

export const useProvideChipColors = () => {
  const resolveChipColor = (
    badgeColor: string | undefined,
    badgeTitle: string | undefined
  ) =>
    badgeColor
      ? badgeTitle === "Setup"
        ? "#022D5F"
        : chipColors[badgeColor as keyof ChipColors].background
      : undefined;

  const resolveChipLabelColor = (
    badgeColor: string | undefined,
    badgeTitle: string | undefined
  ) =>
    badgeColor
      ? badgeTitle === "Setup"
        ? "white"
        : chipColors[badgeColor as keyof ChipColors].text
      : undefined;

  return { resolveChipColor, resolveChipLabelColor };
};

interface ChipColors {
  blue: Blue;
  yellow: Blue;
  green: Blue;
  red: Blue;
  purple: Blue;
  brown: Blue;
  rose: Blue;
  kaki: Blue;
  orange: Blue;
}

interface Blue {
  text: string;
  background: string;
}
