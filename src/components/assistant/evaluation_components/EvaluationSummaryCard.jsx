import { Box, Typography } from "@mui/material";

const EvaluationSummaryCard = ({
  title,
  value,
  subValue,
  footer,
  icon,
  iconBg,
  isDark,
}) => {
  const cardBg = isDark ? "#111827" : "#FFFFFF";
  const cardBorder = isDark ? "1px solid #243041" : "1px solid #E5E7EB";

  const valueColor = isDark ? "#F8FAFC" : "#0E151E";
  const subValueColor = "#94A3B8";
  const titleColor = "#71717A";
  const footerColor = "#71717A";

  const dividerColor = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(0,0,0,0.15)";

  const iconContainerBg = iconBg || (isDark ? "#1E293B" : "#EEF3FF");

  const footerParts =
    typeof footer === "string" && footer.includes(":")
      ? footer.split(":")
      : null;

  const footerLabel = footerParts ? `${footerParts[0]}:` : footer;
  const footerValue = footerParts ? footerParts.slice(1).join(":").trim() : "";

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "150px",
        bgcolor: cardBg,
        borderRadius: "8px",
        border: cardBorder,
        boxShadow: isDark
          ? "0px 2px 8px rgba(0,0,0,0.30)"
          : "0px 1px 3px rgba(0,0,0,0.10)",
        p: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            minWidth: 0,
            flex: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "17px",
              minHeight: "32px",
              flexWrap: "wrap",
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                lineHeight: "32px",
                fontWeight: 400,
                color: valueColor,
                letterSpacing: 0,
              }}
            >
              {value}
            </Typography>

            <Typography
              sx={{
                fontSize: "12px",
                lineHeight: "16px",
                fontWeight: 400,
                color: subValueColor,
                letterSpacing: 0,
              }}
            >
              {subValue}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: titleColor,
              letterSpacing: 0,
              wordBreak: "break-word",
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box
          sx={{
            width: "64px",
            height: "64px",
            minWidth: "64px",
            borderRadius: "12px",
            bgcolor: iconContainerBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                width: "30px",
                height: "30px",
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "1px",
          bgcolor: dividerColor,
          my: "12px",
        }}
      />

      {footerParts ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            minHeight: "20px",
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: footerColor,
              letterSpacing: 0,
            }}
          >
            {footerLabel}
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: footerColor,
              letterSpacing: 0,
            }}
          >
            {footerValue}
          </Typography>
        </Box>
      ) : (
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 400,
            color: footerColor,
            letterSpacing: 0,
            wordBreak: "break-word",
          }}
        >
          {footer}
        </Typography>
      )}
    </Box>
  );
};

export default EvaluationSummaryCard;